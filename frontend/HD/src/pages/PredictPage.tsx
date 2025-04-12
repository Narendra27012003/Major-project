import { useState } from "react";
import axios from "axios";
import { jsPDF } from "jspdf"; // 📄 for PDF download
import "./PredictPage.css";

function PredictPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    age: "",
    gender: "",
    cp: "",
    trestbps: "",
    chol: "",
    fbs: "",
    restecg: "",
    thalach: "",
    exang: "",
    oldpeak: "",
    slope: "",
    ca: "",
    thal: ""
  });

  const [result, setResult] = useState<string | null>(null);
  const [predictionPercent, setPredictionPercent] = useState<number | null>(null);

  const handleChange = (e: { target: { name: string; value: string } }) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const { name, email, age, gender, cp, trestbps, chol, fbs, restecg, thalach, exang, oldpeak, slope, ca, thal } = formData;

    if (!name.trim()) {
      alert("Name is required");
      return false;
    }

    if (!email.trim() || !email.includes("@")) {
      alert("Valid email is required");
      return false;
    }

    if (Number(age) < 29 || Number(age) > 77) {
      alert("Age must be between 29 and 77.");
      return false;
    }

    if (!(gender === "0" || gender === "1")) {
      alert("Gender must be 0 (Female) or 1 (Male).");
      return false;
    }

    if (!(["0", "1", "2", "3"].includes(cp))) {
      alert("Chest Pain Type must be between 0 and 3.");
      return false;
    }

    if (Number(trestbps) < 94 || Number(trestbps) > 200) {
      alert("Resting Blood Pressure must be between 94 and 200 mm Hg.");
      return false;
    }

    if (Number(chol) < 126 || Number(chol) > 564) {
      alert("Cholesterol must be between 126 and 564 mg/dl.");
      return false;
    }

    if (!(fbs === "0" || fbs === "1")) {
      alert("Fasting Blood Sugar must be 0 or 1.");
      return false;
    }

    if (!(["0", "1", "2"].includes(restecg))) {
      alert("Resting ECG must be 0, 1, or 2.");
      return false;
    }

    if (Number(thalach) < 71 || Number(thalach) > 202) {
      alert("Max Heart Rate must be between 71 and 202 BPM.");
      return false;
    }

    if (!(exang === "0" || exang === "1")) {
      alert("Exercise Induced Angina must be 0 or 1.");
      return false;
    }

    if (Number(oldpeak) < 0 || Number(oldpeak) > 6.2) {
      alert("Old Peak must be between 0 and 6.2.");
      return false;
    }

    if (!(["0", "1", "2"].includes(slope))) {
      alert("Slope must be 0, 1, or 2.");
      return false;
    }

    if (!(["0", "1", "2", "3"].includes(ca))) {
      alert("Number of Major Vessels must be between 0 and 3.");
      return false;
    }

    if (!(["0", "1", "2"].includes(thal))) {
      alert("Thalassemia Type must be 0, 1, or 2.");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    if (!token) {
      alert("You are not authorized. Please login first.");
      return;
    }

    if (!validateForm()) return;

    try {
      const { data } = await axios.post(
        "http://localhost:8000/predict",
        {
          ...formData,
          age: Number(formData.age),
          gender: Number(formData.gender),
          cp: Number(formData.cp),
          trestbps: Number(formData.trestbps),
          chol: Number(formData.chol),
          fbs: Number(formData.fbs),
          restecg: Number(formData.restecg),
          thalach: Number(formData.thalach),
          exang: Number(formData.exang),
          oldpeak: parseFloat(formData.oldpeak),
          slope: Number(formData.slope),
          ca: Number(formData.ca),
          thal: Number(formData.thal)
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      console.log("API Response:", data);

      if (data.result.includes("High")) {
        setPredictionPercent(80);
      } else {
        setPredictionPercent(20);
      }

      setResult(data.result);
      generatePDF(data.result, predictionPercent!);

    } catch (error) {
      console.error("Prediction failed:", error);
      alert("Prediction failed! Please login again or check your data.");
    }
  };

  const generatePDF = (modelResult: string, percent: number) => {
    const doc = new jsPDF();
    doc.setFontSize(22);
    doc.text("Heart Disease Prediction Report", 20, 30);

    doc.setFontSize(14);
    doc.text(`Name: ${formData.name}`, 20, 50);
    doc.text(`Email: ${formData.email}`, 20, 60);

    let y = 80;
    for (const key in formData) {
      if (key !== "name" && key !== "email") {
        doc.text(`${key.toUpperCase()}: ${formData[key as keyof typeof formData]}`, 20, y);
        y += 10;
      }
    }

    doc.text(`Model Prediction: ${modelResult}`, 20, y + 10);
    doc.text(`Predicted Risk: ${percent}%`, 20, y + 20);
    doc.text("Thank you for using the Heart Disease Predictor!", 20, y + 40);
    doc.save("Heart_Disease_Report.pdf");
  };

  const openChatBot = () => {
    window.open("/chatbot", "_blank");  // 🚀 Opens chatbot in new tab
  };

  return (
    <>
      <div className="nav">
        <div className="nav-links">
          <a href="/">Home</a>
          <a href="/predict">Predict</a>
          <a href="/auth/login">Logout</a>
        </div>
      </div>

      {/* 🆕 Added ChatBot Button here */}
      <div style={{ textAlign: "right", margin: "20px" }}>
        <button onClick={openChatBot} style={{ padding: "10px 20px", backgroundColor: "#4CAF50", color: "white", border: "none", borderRadius: "8px", cursor: "pointer" }}>
          💬 Ask AI Assistant
        </button>
      </div>

      <section>
        <div className="container">
          <h1 id="title">Heart Disease Prediction Form</h1>
          <form onSubmit={handleSubmit}>
            {Object.keys(formData).map((field) => (
              <div className="inputwrap col" key={field}>
                <label className="bold">{field.toUpperCase()}</label>
                <input
                  name={field}
                  placeholder={field}
                  onChange={handleChange}
                  value={formData[field as keyof typeof formData]}
                  required
                />
              </div>
            ))}
            <button type="submit">Predict</button>
          </form>

          {result && (
            <h2 style={{ textAlign: "center", marginTop: "20px" }}>
              Prediction Result: {result} <br />
              Predicted Risk: {predictionPercent}% Chance
            </h2>
          )}
        </div>
      </section>
    </>
  );
}

export default PredictPage;
