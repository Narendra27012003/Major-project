import { useState } from "react";
import axios from "axios";
import { jsPDF } from "jspdf";
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

  const [results, setResults] = useState<{
    logistic: string;
    randomforest: string;
    logistic_accuracy: number;
    randomforest_accuracy: number;
  } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const { name, email, age, gender, cp, trestbps, chol, fbs, restecg, thalach, exang, oldpeak, slope, ca, thal } = formData;
    if (!name.trim()) return alert("Name is required"), false;
    if (!email.trim() || !email.includes("@")) return alert("Valid email is required"), false;
    if (Number(age) < 29 || Number(age) > 77) return alert("Age must be between 29 and 77"), false;
    if (!["0", "1"].includes(gender)) return alert("Gender must be 0 (Female) or 1 (Male)"), false;
    if (!["0", "1", "2", "3"].includes(cp)) return alert("Chest Pain Type must be between 0 and 3"), false;
    if (Number(trestbps) < 94 || Number(trestbps) > 200) return alert("Resting BP must be 94–200"), false;
    if (Number(chol) < 126 || Number(chol) > 564) return alert("Cholesterol must be 126–564"), false;
    if (!["0", "1"].includes(fbs)) return alert("Fasting Blood Sugar must be 0 or 1"), false;
    if (!["0", "1", "2"].includes(restecg)) return alert("Resting ECG must be 0, 1, or 2"), false;
    if (Number(thalach) < 71 || Number(thalach) > 202) return alert("Max Heart Rate must be 71–202"), false;
    if (!["0", "1"].includes(exang)) return alert("Exercise Induced Angina must be 0 or 1"), false;
    if (Number(oldpeak) < 0 || Number(oldpeak) > 6.2) return alert("Old Peak must be 0–6.2"), false;
    if (!["0", "1", "2"].includes(slope)) return alert("Slope must be 0, 1, or 2"), false;
    if (!["0", "1", "2", "3"].includes(ca)) return alert("Major Vessels must be 0–3"), false;
    if (!["0", "1", "2"].includes(thal)) return alert("Thal Type must be 0, 1, or 2"), false;
    return true;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) return alert("You are not authorized. Please login first.");
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

      setResults({
        logistic: data.logistic_result,
        randomforest: data.randomforest_result,
        logistic_accuracy: data.logistic_accuracy,
        randomforest_accuracy: data.randomforest_accuracy
      });

      generatePDF(data);

    } catch (error) {
      console.error("Prediction failed:", error);
      alert("Prediction failed! Please login again or check your data.");
    }
  };

  const generatePDF = (data: any) => {
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

    doc.text(`Logistic Regression Result: ${data.logistic_result}`, 20, y + 10);
    doc.text(`Logistic Accuracy: ${data.logistic_accuracy.toFixed(2)}%`, 20, y + 20);
    doc.text(`Random Forest Result: ${data.randomforest_result}`, 20, y + 30);
    doc.text(`Random Forest Accuracy: ${data.randomforest_accuracy.toFixed(2)}%`, 20, y + 40);
    doc.text("Thank you for using the Heart Disease Predictor!", 20, y + 60);

    doc.save("Heart_Disease_Report.pdf");
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

      <div style={{ textAlign: "right", margin: "20px" }}>
        <button onClick={() => window.open("/chatbot", "_blank")} style={{ padding: "10px 20px", backgroundColor: "#4CAF50", color: "white", border: "none", borderRadius: "8px", cursor: "pointer" }}>
          💬 Ask AI Assistant
        </button>
      </div>

      <section>
        <div className="container">
          <h1 id="title">Heart Disease Prediction Form</h1>
          <form onSubmit={handleSubmit}>
            {Object.keys(formData).map((field) => (
              <div className="inputwrap full" key={field}>
                <label className="bold">
                  {field === "name" ? "Name" :
                    field === "email" ? "Email" :
                    field === "age" ? "Age (29-77)" :
                    field === "gender" ? "Gender (0=Female, 1=Male)" :
                    field === "cp" ? "Chest Pain Type (0-3)" :
                    field === "trestbps" ? "Resting BP (94–200)" :
                    field === "chol" ? "Cholesterol (126–564)" :
                    field === "fbs" ? "Fasting Sugar (0 or 1)" :
                    field === "restecg" ? "Resting ECG (0,1,2)" :
                    field === "thalach" ? "Max Heart Rate (71–202)" :
                    field === "exang" ? "Exercise Angina (0 or 1)" :
                    field === "oldpeak" ? "Old Peak (0–6.2)" :
                    field === "slope" ? "Slope (0,1,2)" :
                    field === "ca" ? "Major Vessels (0–3)" :
                    field === "thal" ? "Thal Type (0,1,2)" : field.toUpperCase()}
                </label>
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

          {results && (
            <h2 style={{ textAlign: "center", marginTop: "20px" }}>
            Logistic: {results.logistic} ({results.logistic_accuracy.toFixed(2)}%) <br />
            Random Forest: {results.randomforest} ({results.randomforest_accuracy.toFixed(2)}%)
          </h2>
          
          )}
        </div>
      </section>
    </>
  );
}

export default PredictPage;
