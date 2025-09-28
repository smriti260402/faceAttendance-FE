// src/components/Header.jsx
import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/authContext.jsx";
import Logo from "../assets/logo.png";
import "./header.css";

const Header = () => {
  const { user, logoutUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [showConfirm, setShowConfirm] = useState(false);

  const handleLogout = () => {
    setShowConfirm(false); // Close modal first
    logoutUser();
    navigate("/");
  };

  return (
    <header className="header-container">
      <div className="header-left">
        <img src={Logo} alt="Logo" className="header-logo" />
      </div>

      <div className="header-center">
        <h1 className="header-title">Attend Ease</h1>
      </div>

      <div className="header-right">
        {user ? (
          <button
            className="logout-button"
            onClick={() => setShowConfirm(true)}
          >
            Logout
          </button>
        ) : (
          <span className="welcome-text">Welcome!</span>
        )}
      </div>

      {/* Logout Confirmation Modal */}
      {showConfirm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Are you sure you want to logout?</h3>
            <div className="modal-buttons">
              <button className="modal-yes" onClick={handleLogout}>
                Yes
              </button>
              <button
                className="modal-no"
                onClick={() => setShowConfirm(false)}
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
