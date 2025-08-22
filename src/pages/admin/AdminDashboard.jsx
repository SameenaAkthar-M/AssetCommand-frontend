import { useState } from "react";
import AdminNavbar from "../../components/adminnavbar/AdminNavbar.jsx";
import Assets from "./components/Assets.jsx";
import Bases from "./components/Bases.jsx";
import Transfers from "./components/Transfers.jsx";
import Assignments from "./components/Assignments.jsx";
import Expenditures from "./components/Expenditures.jsx";
import Users from "./components/Users.jsx";
import Purchase from "./components/Purchase.jsx";
import "./admin.css";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const [activeSection, setActiveSection] = useState("assets");
  const [showLogout, setShowLogout] = useState(false);

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="admin-dashboard-container">
      <div className="admin-header">
        <h1 className="admin-dashboard-header">Admin</h1>

        <div
          className="profile-container"
          onMouseEnter={() => setShowLogout(true)}
          onMouseLeave={() => setShowLogout(false)}
        >
          <img src="/profile.svg" alt="Profile" className="profile-image" />
          {showLogout && (
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          )}
        </div>
      </div>

      <AdminNavbar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
      />

      <div className="admin-dashboard-section">
        {activeSection === "assets" && <Assets />}
        {activeSection === "bases" && <Bases />}
        {activeSection === "transfers" && <Transfers />}
        {activeSection === "purchases" && <Purchase />}
        {activeSection === "assignments" && <Assignments />}
        {activeSection === "expenditures" && <Expenditures />}
        {activeSection === "users" && <Users />}
      </div>
    </div>
  );
};

export default AdminDashboard;
