import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import "../styles/main.css";

export default function MyLeaves() {
  const { token, user } = useAuth();
  const [leaves, setLeaves] = useState([]);
  const [managerName, setManagerName] = useState("");

  // Fetch manager name
  useEffect(() => {
    if (!token || !user?.managerId) return;

    fetch(`http://localhost:5000/api/auth/user/${user.managerId}`, {
      headers: { Authorization: "Bearer " + token },
    })
      .then((r) => r.json())
      .then((d) => {
        if (d?.name) setManagerName(d.name);
      })
      .catch(() => {});
  }, [token, user]);

  // Fetch user's leaves
  useEffect(() => {
    if (!token) return;

    fetch("http://localhost:5000/api/leave/my", {
      headers: { Authorization: "Bearer " + token },
    })
      .then((r) => r.json())
      .then((d) => Array.isArray(d) && setLeaves(d))
      .catch(() => setLeaves([]));
  }, [token]);

  // Cancel leave
  const cancelLeave = async (id) => {
    if (!window.confirm("Cancel this leave?")) return;

    const res = await fetch("http://localhost:5000/api/leave/cancel/" + id, {
      method: "PATCH",
      headers: { Authorization: "Bearer " + token },
    });

    const d = await res.json();
    alert(d.message || "Done");

    setLeaves((prev) => prev.filter((l) => l._id !== id));
  };

  // ICON + COLOR indicator
  const getStatusIndicator = (status) => {
    switch (status) {
      case "Approved":
        return (
          <span className="status-icon approved">
            🟢 Approved
          </span>
        );
      case "Rejected":
        return (
          <span className="status-icon rejected">
            🔴 Rejected
          </span>
        );
      default:
        return (
          <span className="status-icon pending">
            🟠 Pending
          </span>
        );
    }
  };

  return (
    <div className="container">
      <h2>My Leaves</h2>

      {/* Show manager name */}
      <div className="card" style={{ marginBottom: 15 }}>
        <h3>Your Manager</h3>
        <p style={{ fontSize: "18px", fontWeight: "600", color: "#143d93" }}>
          {managerName || "Not Assigned"}
        </p>
      </div>

      <div className="card">
        {leaves.length === 0 ? (
          <p>No leaves found.</p>
        ) : (
          leaves.map((l) => (
            <div className="list-item" key={l._id}>
              <div>
                {/* Leave Type */}
                <strong style={{ fontSize: "18px", color: "#143d93" }}>
                  {l.leaveType}
                </strong>

                {/* Dates */}
                <div className="text-muted">
                  {new Date(l.startDate).toLocaleDateString()} →{" "}
                  {new Date(l.endDate).toLocaleDateString()}
                </div>

                {/* NEW Status Indicator */}
                <div style={{ marginTop: 6 }}>
                  {getStatusIndicator(l.status)}
                </div>

                {/* Manager Comments */}
                {l.managerComments && (
                  <div
                    style={{
                      marginTop: 8,
                      fontStyle: "italic",
                      color: "#1b3c75",
                    }}
                  >
                    Manager Comment: {l.managerComments}
                  </div>
                )}
              </div>

              {/* Cancel Button for Pending Only */}
              {l.status === "Pending" && (
                <div style={{ marginTop: 8 }}>
                  <button
                    className="btn-danger"
                    onClick={() => cancelLeave(l._id)}
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
