import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./UserManagement.css";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null); // user for history modal
  const [attendanceHistory, setAttendanceHistory] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/admin/user-management");
      setUsers(res.data);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  const handleDelete = async (id, role) => {
    if (role === "ADMIN") {
      alert("Admin cannot be deleted!");
      return;
    }
    try {
      await axios.delete(`http://localhost:5000/admin/users/${id}`);
      setUsers(users.filter((u) => u.id !== id));
    } catch (err) {
      console.error("Error deleting user:", err);
    }
  };

  const handleViewHistory = async (user) => {
    setSelectedUser(user);
    try {
      const res = await axios.get(
        `http://localhost:5000/admin/users/${user.id}/attendance-history`
      );
      setAttendanceHistory(res.data);
      setShowModal(true);
    } catch (err) {
      console.error("Error fetching attendance history:", err);
    }
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="user-management-container">
      <button className="back-button" onClick={() => navigate("/admin/dashboard")}>
        &larr; Back
      </button>
      <h2 className="user-management-title">User Management</h2>

      <div className="table-wrapper">
        <table className="user-table">
          <thead>
            <tr>
              <th>User ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan="4">No users found</td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>
                    {user.role !== "ADMIN" && (
                      <>
                        <button
                          className="view-history-button"
                          onClick={() => handleViewHistory(user)}
                        >
                          View Attendance History
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Side modal for attendance history */}
      {showModal && selectedUser && (
        <div className="modal-overlay">
          <div className="modal-content side-modal">
            <h2>User ID: {selectedUser.id}</h2>
            <h3>Attendance History</h3>
            <div className="attendance-history">
              {attendanceHistory.length === 0 ? (
                <p>No attendance records</p>
              ) : (
                <table>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {attendanceHistory.map((record, index) => (
                      <tr key={index}>
                        <td>{formatDate(record.timestamp)}</td>
                        <td
                          className={
                            record.type === "PRESENT" ? "present" : "absent"
                          }
                        >
                          {record.type}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
            <button className="close-modal" onClick={() => setShowModal(false)}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
