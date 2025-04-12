import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./components/layout/MainLayout";
import Login from "./pages/Auth/Login";
import Signup from "./pages/Auth/Signup";
import Home from "./pages/Home";
import "./App.css";
import ProtectedComponent from "./components/layout/ProtectedComponent";
import ThankYou from "./pages/Thankyou";
import PredictPage from "./pages/PredictPage";
import ChatBotPage from "./components/ChatBotPage"; // 👈 Import Chatbot Page

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />

          {/* Protected Routes */}
          <Route element={<ProtectedComponent />}>
            <Route path="/predict" element={<PredictPage />} />
            <Route path="/thank-you" element={<ThankYou />} />
            <Route path="/chatbot" element={<ChatBotPage />} /> {/* 👈 Add ChatBotPage here */}
          </Route>

          {/* Public Routes */}
          <Route path="/auth/login" element={<Login />} />
          <Route path="/auth/signup" element={<Signup />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
