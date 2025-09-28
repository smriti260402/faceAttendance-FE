// src/components/Footer.jsx
import React from "react";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer-container">
      <p className="footer-description">
        Face Attendance System: A modern solution for tracking attendance using face recognition technology, designed to simplify and automate attendance management.
      </p>
      <p className="footer-creator">Made by Smriti Sinha</p>
      <p className="footer-copyright">&copy; {new Date().getFullYear()}</p>
    </footer>
  );
};

export default Footer;
