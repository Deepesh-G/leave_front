import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import "../styles/main.css";

export default function TeamCalendar() {
  const { token } = useAuth();
  const [leaves, setLeaves] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [searchDate, setSearchDate] = useState("");

  useEffect(() => {
    if (!token) return;

    fetch("http://localhost:5000/api/leave/calendar", {
      headers: { Authorization: "Bearer " + token },
    })
      .then((r) => r.json())
      .then((d) => {
        if (Array.isArray(d)) {
          setLeaves(d);
          setFiltered(d);
        }
      })
      .catch(() => setLeaves([]));
  }, [token]);

  // Format date for display
  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  // Handle search filtering
  const handleSearch = (value) => {
    setSearchDate(value);

    if (!value) {
      setFiltered(leaves);
      return;
    }

    const chosen = new Date(value);

    const result = leaves.filter((l) => {
      const start = new Date(l.startDate);
      const end = new Date(l.endDate);
      return chosen >= start && chosen <= end;
    });

    setFiltered(result);
  };

  return (
    <div className="container">
      <h2>Team Calendar</h2>

      {/* 🔍 Search by Date */}
      <div style={{ marginBottom: "15px" }}>
        <label style={{ fontWeight: "bold", marginRight: "10px" }}>
          Search by Date:
        </label>

        <input
          type="date"
          value={searchDate}
          onChange={(e) => handleSearch(e.target.value)}
          className="input-field"
        />
      </div>

      <div className="card">
        {filtered.length === 0 ? (
          <p>No leaves found for selected date</p>
        ) : (
          filtered.map((l) => (
            <div className="list-item" key={l._id}>
              <div>
                <strong style={{ color: "#143d93", fontSize: "16px" }}>
                  {l.userId?.name}
                </strong>{" "}
                — {l.leaveType}

                <div className="text-muted">
                  {formatDate(l.startDate)} → {formatDate(l.endDate)}
                </div>

                {l.managerComments && (
                  <div style={{ marginTop: 6, fontStyle: "italic" }}>
                    Manager: {l.managerComments}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
