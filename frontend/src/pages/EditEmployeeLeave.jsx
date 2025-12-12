import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useParams } from "react-router-dom";

export default function EditEmployeeLeave() {
  const { token } = useAuth();
  const { id } = useParams(); // employeeId
  const [balance, setBalance] = useState({ casual: 0, sick: 0, earned: 0 });

  useEffect(() => {
    fetch(`http://localhost:5000/api/manager/leave/balance/${id}`, {
      headers: { Authorization: "Bearer " + token },
    })
      .then((r) => r.json())
      .then(setBalance);
  }, [id, token]);

  const updateBalance = async () => {
    const res = await fetch(`http://localhost:5000/api/manager/leave/edit-balance/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify(balance),
    });

    const data = await res.json();
    alert(data.message || "Updated");
  };

  return (
    <div className="container">
      <h2>Edit Leave Balance</h2>

      <div className="card">
        <label>Casual Leave</label>
        <input
          type="number"
          value={balance.casual}
          onChange={(e) => setBalance({ ...balance, casual: Number(e.target.value) })}
        />

        <label>Sick Leave</label>
        <input
          type="number"
          value={balance.sick}
          onChange={(e) => setBalance({ ...balance, sick: Number(e.target.value) })}
        />

        <label>Earned Leave</label>
        <input
          type="number"
          value={balance.earned}
          onChange={(e) => setBalance({ ...balance, earned: Number(e.target.value) })}
        />

        <button className="btn-primary" onClick={updateBalance}>
          Save Changes
        </button>
      </div>
    </div>
  );
}
