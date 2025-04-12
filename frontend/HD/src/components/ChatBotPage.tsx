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
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognitionClass();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event: any) => {
      const speechResult = event.results[0][0].transcript;
      console.log("Speech received: " + speechResult);
      setInput(speechResult); // Set spoken text into input field
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
      const response = await fetch("http://localhost:8000/ask-ai", {  // 🎯 Your backend AI endpoint
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: input }),
      });

      const data = await response.json();
      setMessages((prev) => [...prev, "AI: " + data.response]);
      setInput("");
    } catch (error) {
      console.error("Error chatting with AI:", error);
      setMessages((prev) => [...prev, "AI: Failed to get response."]);
    }
  };

  return (
    <div className="chatbot-page">
      <h1>🧠 AI Assistant</h1>

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
