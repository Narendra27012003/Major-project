import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/Auth.css";
import FormContainer from "../../components/FormContainer";
import { signin } from "../../api/auth"; // Adjust the import path as needed

function Login() {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e: { target: { name: any; value: any; }; }) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const { data } = await signin(formData);
      localStorage.setItem("token", data.access_token);
      navigate("/predict");

    } catch (error: any) {
      alert(error.response?.data?.detail || "Login failed");
    }
  };

  return (
    <div className="auth-grid">
      <div className="auth-text">
        <h1>Heart Disease Prediction</h1>
        <p> We help you assess your heart health quickly and accurately using the latest machine learning technology.</p>
      </div>
      <FormContainer title="Login">
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="username"
            placeholder="Username"
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
          <button type="submit">LOGIN</button>
        </form>
        <p className="switch-auth" onClick={() => navigate("/auth/signup")}>
          Don't have an account? Sign Up
        </p>
      </FormContainer>
    </div>
  );
}

export default Login;
