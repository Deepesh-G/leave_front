import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import '../styles/main.css';

export default function EmployeeDashboard() {
  const { user, token } = useAuth();
  const [balance, setBalance] = useState({ casual: 0, sick: 0, earned: 0 });
  const [manager, setManager] = useState(null);

  // Fetch Manager Details (name + managerCode)
  useEffect(() => {
    if (!token || !user?.managerId) return;

    fetch(`http://localhost:5000/api/auth/user/${user.managerId}`, {
      headers: { Authorization: "Bearer " + token }
    })
      .then(res => res.json())
      .then(data => {
        if (data?.name) setManager(data);
      })
      .catch(() => {});
  }, [token, user]);

  // Fetch Leave Balance
  useEffect(() => {
    if (!token) return;

    fetch("http://localhost:5000/api/leave/balance", {
      headers: { Authorization: "Bearer " + token }
    })
      .then(res => res.json())
      .then(data => {
        if (data.casual !== undefined) setBalance(data);
      })
      .catch(() => {});
  }, [token]);

  return (
    <div className="container">
      <Navbar />

      <div className="header">
        <h2>Employee Dashboard</h2>
      </div>

      <div className="dashboard-grid">

        {/* LEFT COLUMN */}
        <div>
          {/* Employee Welcome Card */}
          <div className="card">
            <h3>Welcome, {user?.name}</h3>

            <p style={{ marginTop: 10 }}>
              <strong style={{ color: "#143d93" }}>Manager:</strong>{" "}
              {manager ? manager.name : "Not Assigned"}
            </p>

            <p>
              <strong style={{ color: "#143d93" }}>Manager ID:</strong>{" "}
              {manager?.managerCode || "N/A"}
            </p>
          </div>

          {/* Quick Actions */}
          <div className="card" style={{ marginTop: 12 }}>
            <h4>Quick Actions</h4>

            <p>
              <Link to="/apply">Apply Leave</Link>
            </p>

            <p>
              <Link to="/my-leaves">My Leaves</Link>
            </p>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <aside>
          <div className="card">
            <h4>Leave Balance</h4>

            <p>Casual: {balance.casual}</p>
            <p>Sick: {balance.sick}</p>
            <p>Earned: {balance.earned}</p>
          </div>
        </aside>
      </div>
    </div>
  );
}
