import { Outlet } from "react-router-dom";

import "./MainLayout.css";
import Logo from "../icons/Logo";

function MainLayout() {
  return (
    <div>
      <div className="top-nav">
        <div className="logo-container">
          <Logo />
          <p className="heading">Heart Disease Prediction</p> {/* Text changed only */}
        </div>
      </div>

      <div className="layout-container">
        <Outlet />
      </div>
    </div>
  );
}

export default MainLayout;
