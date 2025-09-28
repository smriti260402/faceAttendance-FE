// src/components/PrivateRoute.jsx
import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/authContext.jsx";
import "../pages/auth/login.css"; // reuse login page styles

const PrivateRoute = ({ children }) => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="login-container">
        <h2 className="login-title">⚠️ Please Sign In First</h2>
        <button className="login-button" onClick={() => navigate("/")}>
          Sign In
        </button>
      </div>
    );
  }

  return children;
};

export default PrivateRoute;
