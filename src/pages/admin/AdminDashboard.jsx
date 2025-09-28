import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/authContext.jsx";
import MarkAttendance from "../user/MarkAttendance.jsx"; 
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const { user } = useContext(AuthContext); 
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalPresent: 0,
    totalAbsent: 0,
  });
  const [showMarkModal, setShowMarkModal] = useState(false);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await axios.get("http://localhost:5000/admin/dashboard-stats");
      setStats(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="ad-container">
      <h2 className="ad-title">Admin Dashboard</h2>

      <div className="ad-stats">
        <div className="ad-card">
          <h3>Total Users</h3>
          <p>{stats.totalUsers}</p>
        </div>
        <div className="ad-card">
          <h3>Present Today</h3>
          <p>{stats.totalPresent}</p>
        </div>
        <div className="ad-card">
          <h3>Absent Today</h3>
          <p>{stats.totalAbsent}</p>
        </div>
      </div>

      <div className="ad-actions">
        <button onClick={() => navigate("/admin/users")} className="ad-button">
          User Management
        </button>

        <button
          onClick={() => setShowMarkModal(true)}
          className="ad-button"
          style={{ marginLeft: "10px" }}
        >
          Mark My Attendance
        </button>
      </div>

      {showMarkModal && (
        <MarkAttendance
          userId={user?.id} 
          onClose={() => setShowMarkModal(false)}
          onMarked={() => {
            setShowMarkModal(false);
            fetchStats();          
          }}
        />
      )}
    </div>
  );
};

export default AdminDashboard;
