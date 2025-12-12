import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import ManagerDashboard from "./pages/ManagerDashboard";
import ApplyLeave from "./pages/ApplyLeave";
import MyLeaves from "./pages/MyLeaves";
import TeamLeaves from "./pages/TeamLeaves";
import TeamHistory from "./pages/TeamHistory";
import TeamCalendar from "./pages/TeamCalendar";
import EditEmployeeLeave from "./pages/EditEmployeeLeave";
import { useAuth } from "./context/AuthContext";

function RequireAuth({ children }) {
  const { token, loading } = useAuth();

  if (loading) return <div className="loading-screen">Loading...</div>;

  if (!token) return <Navigate to="/" />;

  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/employee"
          element={
            <RequireAuth>
              <EmployeeDashboard />
            </RequireAuth>
          }
        />

        <Route
          path="/manager"
          element={
            <RequireAuth>
              <ManagerDashboard />
            </RequireAuth>
          }
        />

        <Route
          path="/apply"
          element={
            <RequireAuth>
              <ApplyLeave />
            </RequireAuth>
          }
        />

        <Route
          path="/my-leaves"
          element={
            <RequireAuth>
              <MyLeaves />
            </RequireAuth>
          }
        />

        <Route
          path="/team-leaves"
          element={
            <RequireAuth>
              <TeamLeaves />
            </RequireAuth>
          }
        />

        <Route
          path="/team-history"
          element={
            <RequireAuth>
              <TeamHistory />
            </RequireAuth>
          }
        />

        <Route
          path="/team-calendar"
          element={
            <RequireAuth>
              <TeamCalendar />
            </RequireAuth>
          }
        />

        <Route
          path="/edit-leave/:id"
          element={
            <RequireAuth>
              <EditEmployeeLeave />
            </RequireAuth>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
