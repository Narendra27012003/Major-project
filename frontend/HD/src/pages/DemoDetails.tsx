import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/DemoDetails.css";
import FormContainer from "../components/FormContainer";

interface DemoDetailsFormData {
  url: string;
  file: File | null;
}

function DemoDetails() {
  const [formData, setFormData] = useState<DemoDetailsFormData>({
    url: "",
    file: null,
  });
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;
    if (name === "file" && files) {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Demo Details Form Data:", formData);
    navigate("/home");
  };

  return (
    <div className="auth-grid">
      <div className="auth-text">
        <h1>Demo Assist</h1>
        <p>
         Experience Demo Assist's Agentic Demo Bot for top-quality, interactive AI-powered product demos!
        </p>
      </div>

      <FormContainer title="Demo Details">
        <form onSubmit={handleSubmit}>
          <input
            type="url"
            name="url"
            placeholder="https://deloitte.com/home"
            onChange={handleChange}
            required
          />
          <input type="file" name="file" onChange={handleChange} required />
          <button type="submit">SUBMIT</button>
        </form>
      </FormContainer>
    </div>
  );
}

export default DemoDetails;