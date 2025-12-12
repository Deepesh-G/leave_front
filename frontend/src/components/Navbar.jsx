import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const nav = useNavigate();

  const handleLogout = () => {
    logout();
    nav("/");
  };

  return (
    <div className="navbar">
      {/* Left Side Branding */}
      <div className="nav-left">
        <div className="status-dot"></div>
        <h3 className="nav-title">LEAVE MANAGEMENT</h3>
      </div>

      {/* Right Side User Actions */}
      <div className="nav-right">
        {user ? (
          <>
            <span className="nav-user">Hi, {user.name}</span>
            <button className="btn-logout" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <Link className="nav-link" to="/">
            Login
          </Link>
        )}
      </div>
    </div>
  );
}
