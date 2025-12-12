import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const nav = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false); // 👁 Toggle password visibility

  const [role, setRole] = useState("manager");
  const [managerCode, setManagerCode] = useState("");

  const submit = async () => {
    if (!name || !email || !password) {
      alert("Please fill all required fields");
      return;
    }

    const payload = {
      name,
      email: email.trim().toLowerCase(),
      password,
      role,
    };

    if (role === "employee") {
      if (!managerCode.trim()) {
        alert("Manager code is required for employees");
        return;
      }
      payload.managerCode = managerCode.trim();
    }

    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Registration failed");
        return;
      }

      if (role === "manager" && data.managerCode) {
        alert("Manager registered successfully.\nYour Manager Code: " + data.managerCode);
      } else {
        alert("Employee registered successfully!");
      }

      nav("/");
    } catch (err) {
      alert("Network error");
    }
  };

  return (
    <div className="auth-container">
      <h2>Create Account</h2>

      <input
        placeholder="Full Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      {/* Password field with show/hide */}
      <div style={{ position: "relative" }}>
        <input
          placeholder="Password"
          type={showPw ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ width: "100%" }}
        />
        <span
          onClick={() => setShowPw(!showPw)}
          style={{
            position: "absolute",
            right: 12,
            top: "50%",
            transform: "translateY(-50%)",
            cursor: "pointer",
            color: "#2155CD",
            fontWeight: "bold",
          }}
        >
          {showPw ? "Hide" : "Show"}
        </span>
      </div>

      {/* Role selector */}
      <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="manager">Manager</option>
          <option value="employee">Employee</option>
        </select>

        {role === "employee" && (
          <input
            placeholder="Manager Code (MGR-12345)"
            value={managerCode}
            onChange={(e) => setManagerCode(e.target.value)}
          />
        )}
      </div>

      <button
        className="btn-primary"
        style={{ marginTop: 14 }}
        onClick={submit}
      >
        Register
      </button>
    </div>
  );
}
