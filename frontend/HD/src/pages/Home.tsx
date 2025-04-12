import { useNavigate } from "react-router-dom";

import "./../styles/Landing.css";
import ImageSlider from "../components/ImageSlider";

function Home() {
  const navigate = useNavigate();

  const cards = [
    { id: 0, text: "Early Heart Risk Detection" },
    { id: 1, text: "Accurate ML-Based Predictions" },
    { id: 2, text: "User-Friendly Health Check" },
    { id: 3, text: "Quick and Reliable Results" },
    { id: 4, text: "Secure and Confidential" },
  ];

  return (
    <div className="landing-grid">
      <div className="landing-text">
        <h1>Heart Disease Prediction</h1> {/* Updated heading */}
        <p>
          We help you assess your heart health quickly and accurately using the latest machine learning technology.
        </p> {/* Updated paragraph */}
      </div>

      <ImageSlider cards={cards} />

      <button
        className="landing-get-started-button"
        onClick={() => navigate("/auth/login")}
      >
        GET STARTED →
      </button>
    </div>
  );
}

export default Home;
