import { useState } from "react";
import axios from "axios";
import "./PredictPage.css";

function PredictPage() {
  const [formData, setFormData] = useState({
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

  const [result, setResult] = useState("");

  const handleChange = (e: { target: { name: string; value: string } }) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    if (!token) {
      alert("You are not authorized. Please login first.");
      return;
    }

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
      setResult(data.result);
    } catch (error) {
      console.error("Prediction failed:", error);
      alert("Prediction failed! Please login again or check your data.");
    }
  };

  return (
    <>
      <div className="nav">
        <div className="nav-header">
          <div className="nav-title">
          </div>
        </div>
        <div className="nav-links">
          <a href="/">Home</a>
          <a href="/predict">Predict</a>
          <a href="/auth/login">Logout</a> {/* Optional simple logout */}
        </div>
      </div>

      <section>
        <div className="container">
          <h1 id="title">Heart Disease Prediction Form</h1>
          <form onSubmit={handleSubmit}>
            <div className="inputwrap col">
              <label className="bold">Age</label>
              <input name="age" onChange={handleChange} required />
            </div>
            <div className="inputwrap col">
              <label className="bold">Gender (1=Male, 0=Female)</label>
              <input name="gender" onChange={handleChange} required />
            </div>
            <div className="inputwrap col">
              <label className="bold">Chest Pain Type</label>
              <input name="cp" onChange={handleChange} required />
            </div>
            <div className="inputwrap col">
              <label className="bold">Resting Blood Pressure</label>
              <input name="trestbps" onChange={handleChange} required />
            </div>
            <div className="inputwrap col">
              <label className="bold">Cholesterol</label>
              <input name="chol" onChange={handleChange} required />
            </div>
            <div className="inputwrap col">
              <label className="bold">Fasting Blood Sugar (1/0)</label>
              <input name="fbs" onChange={handleChange} required />
            </div>
            <div className="inputwrap col">
              <label className="bold">Resting ECG</label>
              <input name="restecg" onChange={handleChange} required />
            </div>
            <div className="inputwrap col">
              <label className="bold">Max Heart Rate Achieved</label>
              <input name="thalach" onChange={handleChange} required />
            </div>
            <div className="inputwrap col">
              <label className="bold">Exercise Induced Angina (1/0)</label>
              <input name="exang" onChange={handleChange} required />
            </div>
            <div className="inputwrap col">
              <label className="bold">Old Peak</label>
              <input name="oldpeak" onChange={handleChange} required />
            </div>
            <div className="inputwrap col">
              <label className="bold">Slope</label>
              <input name="slope" onChange={handleChange} required />
            </div>
            <div className="inputwrap col">
              <label className="bold">Number of Major Vessels</label>
              <input name="ca" onChange={handleChange} required />
            </div>
            <div className="inputwrap col">
              <label className="bold">Thalassemia Type</label>
              <input name="thal" onChange={handleChange} required />
            </div>
            <button type="submit">Predict</button>
          </form>

          {result && <h2 style={{ textAlign: "center", marginTop: "20px" }}>Prediction Result: {result}</h2>}
        </div>
      </section>
    </>
  );
}

export default PredictPage;
