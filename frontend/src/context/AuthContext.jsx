import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext();

// --------------------------------------
// 🔐 Auth Provider
// --------------------------------------
export const AuthProvider = ({ children }) => {
  // Load saved session
  const storedToken = localStorage.getItem("token") || "";
  const storedUser = (() => {
    try {
      return JSON.parse(localStorage.getItem("user")) || null;
    } catch {
      return null;
    }
  })();

  const [token, setToken] = useState(storedToken);
  const [user, setUser] = useState(storedUser);

  // --------------------------------------
  // 🔑 Login
  // --------------------------------------
  const login = (data) => {
    setToken(data.token);
    setUser(data.user);

    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
  };

  // --------------------------------------
  // 🚪 Logout
  // --------------------------------------
  const logout = () => {
    setToken("");
    setUser(null);

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // Optional: Force redirect to login
    window.location.href = "/";
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// --------------------------------------
// 🔄 Hook to access auth data
// --------------------------------------
export const useAuth = () => useContext(AuthContext);
