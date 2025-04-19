declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

import { useState, useEffect, useRef } from "react";
import "../styles/ChatBotPage.css";

function ChatBotPage() {
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState("");
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (!("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
      alert("Speech Recognition is not supported in your browser. Try using Chrome!");
      return;
    }

    const SpeechRecognitionClass =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognitionClass();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event: any) => {
      const speechResult = event.results[0][0].transcript;
      console.log("Speech received: " + speechResult);
      setInput(speechResult);
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error", event.error);
      setIsListening(false);
    };

    recognitionRef.current = recognition;
  }, []);

  const handleMicClick = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      recognitionRef.current?.start();
      setIsListening(true);
    }
  };

  const handleSend = async () => {
    if (input.trim() === "") return;

    setMessages((prev) => [...prev, "You: " + input]);

    try {
      
      const response = await fetch("http://localhost:8000/ask-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...messages, "You: " + input] }),
      });

      

      const data = await response.json();
      setMessages((prev) => [...prev, "AI: " + data.response]);
      setInput("");
    } catch (error) {
      console.error("Error chatting with AI:", error);
      setMessages((prev) => [...prev, "AI: Failed to get response."]);
    }
  };

  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("http://localhost:8000/analyze-pdf", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      setMessages((prev) => [...prev, "📎 PDF Uploaded.", "AI: " + data.suggestion]);
    } catch (err) {
      setMessages((prev) => [...prev, "AI: Failed to analyze PDF."]);
    }
  };

  return (
    <div className="chatbot-page">
      <h1>🧠 AI Assistant</h1>

      <input type="file" accept="application/pdf" onChange={handlePdfUpload} style={{ marginBottom: "10px" }} />

      <div className="chat-window">
        {messages.map((msg, idx) => (
          <div key={idx} className="chat-message">
            {msg}
          </div>
        ))}
      </div>

      <div className="chat-controls">
        <input
          type="text"
          value={input}
          placeholder="Ask your question..."
          onChange={(e) => setInput(e.target.value)}
        />
        <button onClick={handleSend}>Send</button>
        <button onClick={handleMicClick} className={isListening ? "listening" : ""}>
          🎤
        </button>
      </div>
    </div>
  );
}

export default ChatBotPage;
