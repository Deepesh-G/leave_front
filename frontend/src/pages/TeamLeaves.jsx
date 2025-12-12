import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function TeamLeaves() {
  const { token } = useAuth();
  const [leaves, setLeaves] = useState([]);

  useEffect(() => {
    if (!token) return;

    fetch("http://localhost:5000/api/leave/team", {
      headers: { Authorization: "Bearer " + token },
    })
      .then((r) => r.json())
      .then((d) => Array.isArray(d) && setLeaves(d))
      .catch(() => setLeaves([]));
  }, [token]);

  const getStatusBadge = (status) => {
    if (status === "Approved") return <span className="badge green">Approved</span>;
    if (status === "Rejected") return <span className="badge red">Rejected</span>;
    return <span className="badge yellow">Pending</span>;
  };

  const act = async (id, action) => {
    const comments = prompt("Manager comment (optional)") || "";

    const res = await fetch(`http://localhost:5000/api/leave/${action}/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({ managerComments: comments }),
    });

    const d = await res.json();
    alert(d.message || "Done");

    setLeaves((prev) => prev.map((p) => (p._id === id ? d.leave : p)));
  };

  return (
    <div className="container">
      <h2>Team Leaves</h2>

      <div className="card">
        {leaves.length === 0 ? (
          <p>No leaves</p>
        ) : (
          leaves.map((l) => (
            <div className="list-item" key={l._id}>
              <div>
                <strong>{l.userId?.name}</strong>

                <div>
                  {getStatusBadge(l.status)} • {l.leaveType}
                </div>

                <div className="text-muted">
                  {new Date(l.startDate).toLocaleDateString()} -{" "}
                  {new Date(l.endDate).toLocaleDateString()}
                </div>

                {l.managerComments && (
                  <div style={{ marginTop: 8 }}>
                    <strong>Manager:</strong> {l.managerComments}
                  </div>
                )}
              </div>

              <div style={{ marginTop: 8 }}>
                {l.status === "Pending" && (
                  <>
                    <button className="btn-approve" onClick={() => act(l._id, "approve")}>
                      Approve
                    </button>
                    <button className="btn-reject" onClick={() => act(l._id, "reject")}>
                      Reject
                    </button>
                  </>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
