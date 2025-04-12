import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./components/layout/MainLayout";
import Login from "./pages/Auth/Login";
import Signup from "./pages/Auth/Signup";
import Home from "./pages/Home";
import "./App.css";
import DemoDetails from "./pages/DemoDetails";
import ProtectedComponent from "./components/layout/ProtectedComponent";
import ThankYou from "./pages/Thankyou";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="/" element={<ProtectedComponent />}>
            <Route path="/demo" element={<DemoDetails />} />
            <Route path="/thank-you" element={<ThankYou />} />
            {/* <Route path="home" element={<Home />} /> */}
          </Route>

          <Route path="auth/login" element={<Login />} />
          <Route path="auth/signup" element={<Signup />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
