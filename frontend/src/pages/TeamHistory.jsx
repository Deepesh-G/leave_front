import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function TeamHistory() {
  const { token } = useAuth();
  const [history, setHistory] = useState([]);

  useEffect(() => {
    if (!token) return;

    fetch("http://localhost:5000/api/leave/team-history", {
      headers: { Authorization: "Bearer " + token },
    })
      .then((r) => r.json())
      .then((d) => Array.isArray(d) && setHistory(d))
      .catch(() => setHistory([]));
  }, [token]);

  const getStatusBadge = (status) => {
    if (status === "Approved") return <span className="badge green">Approved</span>;
    if (status === "Rejected") return <span className="badge red">Rejected</span>;
    return <span className="badge yellow">Pending</span>;
  };

  return (
    <div className="container">
      <h2>Team History</h2>

      <div className="card">
        {history.length === 0 ? (
          <p>No history</p>
        ) : (
          history.map((h) => (
            <div className="list-item" key={h._id}>
              <div>
                <strong>{h.userId?.name}</strong>

                <div>
                  {getStatusBadge(h.status)} • {h.leaveType}
                </div>

                <div className="text-muted">
                  {new Date(h.startDate).toLocaleDateString()} -{" "}
                  {new Date(h.endDate).toLocaleDateString()}
                </div>

                {h.managerComments && (
                  <div style={{ marginTop: 8 }}>
                    <strong>Manager:</strong> {h.managerComments}
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
