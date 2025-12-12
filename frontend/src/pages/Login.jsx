import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const nav = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false); // 🔥 toggle password visibility

  const submit = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          password,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.message || "Login failed");
        return;
      }

      login(data);

      if (data.user.role === "manager") nav("/manager");
      else nav("/employee");
    } catch (e) {
      alert("Network error");
    }
  };

  return (
    <div className="auth-container">
      <h2>Login</h2>

      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <div style={{ position: "relative" }}>
        <input
          placeholder="Password"
          type={showPw ? "text" : "password"} // 👈 toggle type
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ width: "100%" }}
        />

        {/* 👁 Eye Toggle Button */}
        <span
          onClick={() => setShowPw(!showPw)}
          style={{
            position: "absolute",
            right: 10,
            top: "50%",
            transform: "translateY(-50%)",
            cursor: "pointer",
            fontSize: "14px",
            color: "#007bff",
          }}
        >
          {showPw ? "Hide" : "Show"}
        </span>
      </div>

      <button className="btn-primary" style={{ marginTop: 12 }} onClick={submit}>
        Login
      </button>

      <p style={{ marginTop: 12 }}>
        No account? <Link to="/register">Register</Link>
      </p>
    </div>
  );
}
