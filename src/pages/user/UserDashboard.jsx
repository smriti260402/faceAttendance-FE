import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../context/authContext.jsx";
import MarkAttendance from "./MarkAttendance.jsx";
import axios from "axios";
import "./UserDashboard.css";

const UserDashboard = () => {
  const { user } = useContext(AuthContext);

  const [attendanceData, setAttendanceData] = useState({
    totalDays: 0,
    attendedDays: 0,
    absentDays: 0,
    percentage: 0,
  });

  const [showMarkModal, setShowMarkModal] = useState(false);
  const [isMarkedToday, setIsMarkedToday] = useState(false);

  // Fetch stats + check if attendance is marked for today
  const fetchAttendance = async () => {
    if (!user?.id) return;

    try {
      // Fetch overall stats
      const res = await axios.get(
        `http://localhost:5000/auth/attendance-stats/${user.id}`
      );
      setAttendanceData(res.data);

      // Check if today's attendance is marked
      const todayMarked = await axios.get(
        `http://localhost:5000/attendance/today/${user.id}`
      );
      setIsMarkedToday(todayMarked.data.isMarked);
    } catch (err) {
      console.error("Error fetching attendance stats:", err);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, [user]);

  // Close modal and refresh stats
  const handleCloseModal = () => {
    setShowMarkModal(false);
    fetchAttendance();
  };

  return (
    <div className="user-dashboard-container">
      <h2 className="user-dashboard-title">
        Welcome, {user?.name || "User"}!
      </h2>

      <div className="user-stats">
        <div className="stat-card">
          <h3>Total Days Attended</h3>
          <p>{attendanceData.attendedDays}</p>
        </div>
        <div className="stat-card">
          <h3>Total Days Absent</h3>
          <p>{attendanceData.absentDays}</p>
        </div>
        <div className="stat-card">
          <h3>Attendance Percentage</h3>
          <p>{attendanceData.percentage}%</p>
        </div>
      </div>

      <div className="attendance-actions">
        <button
          className="mark-attendance-button"
          onClick={() => setShowMarkModal(true)}
          disabled={isMarkedToday} 
        >
          Mark Attendance
        </button>

        {isMarkedToday && (
          <p className="marked-today-text">Attendance marked for today ✅</p>
        )}
      </div>

      {showMarkModal && (
        <MarkAttendance userId={user?.id} onClose={handleCloseModal} />
      )}
    </div>
  );
};

export default UserDashboard;
