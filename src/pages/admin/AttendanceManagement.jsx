import React, { useState } from "react";
import "./AttendanceManagement.css";

const AttendanceManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleBulkUpload = (e) => {
    const file = e.target.files[0];
    // Handle bulk upload logic
    console.log("Bulk file uploaded:", file);
  };

  const handleLiveCapture = () => {
    // Trigger live face capture logic
    console.log("Live capture started");
  };

  return (
    <div className="am-container">
      <h2 className="am-title">Attendance Management</h2>

      <div className="am-actions">
        <button onClick={handleLiveCapture} className="am-button">
          Live Face Capture
        </button>

        <label className="am-button upload-label">
          Bulk Upload
          <input type="file" accept=".csv" onChange={handleBulkUpload} />
        </label>

        <input
          type="text"
          placeholder="Search users..."
          className="am-search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="am-content">
        <p>Attendance list and data will appear here...</p>
        {/* Later replace with dynamic table showing attendance */}
      </div>
    </div>
  );
};

export default AttendanceManagement;
