import { ReactNode } from "react";
import "../styles/FormContainer.css";

interface FormContainerProps {
  title: string;
  children: ReactNode;
}

function FormContainer({ title, children }: FormContainerProps) {
  return (
    <div className="auth-form-container">
      <h2>{title}</h2>
      {children}
    </div>
  );
}

export default FormContainer;