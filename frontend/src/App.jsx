import { BrowserRouter, Routes, Route } from "react-router-dom";
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

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/employee" element={<EmployeeDashboard />} />
        <Route path="/manager" element={<ManagerDashboard />} />

        <Route path="/apply" element={<ApplyLeave />} />
        <Route path="/my-leaves" element={<MyLeaves />} />

        <Route path="/team-leaves" element={<TeamLeaves />} />
        <Route path="/team-history" element={<TeamHistory />} />
        {/* NEW — Edit Leave */}
        <Route path="/edit-leave/:id" element={<EditEmployeeLeave />} />

        {/* ⭐ FIXED ROUTE FOR THE PAGE SHOWING 404 */}
        <Route path="/calendar" element={<TeamCalendar />} />
        

        {/* fallback */}
        <Route path="*" element={<h1>404 — Page Not Found</h1>} />
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;
