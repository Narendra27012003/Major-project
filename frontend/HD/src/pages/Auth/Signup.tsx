import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/Auth.css";
import FormContainer from "../../components/FormContainer";
import { signup } from "../../api/auth"; // Adjust the import path as needed

function Signup() {
  const [formData, setFormData] = useState({ username: "", email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e: { target: { name: any; value: any; }; }) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    try {
      const response = await signup(formData);
      alert("Signup successful:");
      navigate("/auth/login");
    } catch (error) {
      alert("Signup failed:");
      console.error("Signup failed:", error);
    }
  };

  return (
    <div className="auth-grid">
      <div className="auth-text">
        <h1>Heart Disease Prediction</h1>
        <p> We help you assess your heart health quickly and accurately using the latest machine learning technology.</p>
      </div>
      <FormContainer title="Sign Up">
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="username"
            placeholder="Username"
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            required
          />
          <button type="submit">SIGN UP</button>
        </form>
        <p className="switch-auth" onClick={() => navigate("/auth/login")}>
          Already have an account? Login
        </p>
      </FormContainer>
    </div>
  );
}

export default Signup;
