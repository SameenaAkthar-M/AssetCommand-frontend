import { Routes, Route, Navigate } from "react-router-dom";
import AdminNavbar from "../../components/adminnavbar/AdminNavbar.jsx";
import Assets from "./Assets";
import Bases from "./Bases";
import Purchases from "./Purchases";
import Transfers from "./Transfers";
import Assignments from "./Assignments";
import Expenditures from "./Expenditures";
import Users from './Users'

const AdminDashboardRoutes = () => {
  return (
    <div>
      <AdminNavbar />
      <div style={{ padding: "2rem" }}>
        <Routes>
          <Route path="/" element={<Navigate to="/admin/assets" />} />
          <Route path="/admin/assets" element={<Assets />} />
          <Route path="/admin/bases" element={<Bases />} />
          <Route path="/admin/purchases" element={<Purchases />} />
          <Route path="/admin/transfers" element={<Transfers />} />
          <Route path="/admin/assignments" element={<Assignments />} />
          <Route path="/admin/expenditures" element={<Expenditures />} />
          <Route path="/admin/users" element={<Users />} /> 
        </Routes>
      </div>
    </div>
  );
};

export default AdminDashboardRoutes;
