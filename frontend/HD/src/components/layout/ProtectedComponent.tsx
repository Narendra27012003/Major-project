import { Navigate, Outlet } from "react-router-dom";

function ProtectedComponent() {
  const token = localStorage.getItem("token");  // 🛡️ Get token from localStorage

  if (!token) {
    // No token means not logged in ➔ redirect to login page
    return <Navigate to="/auth/login" replace />;
  }

  return <Outlet />;  // Token exists ➔ allow access
}

export default ProtectedComponent;
