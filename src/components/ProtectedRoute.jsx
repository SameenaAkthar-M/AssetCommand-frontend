import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ role, children }) => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  if (!token || !user) {
    return <Navigate to="/" />;
  }
  const userRole = user.role;
  if (role && userRole !== role) {
    if (userRole === "admin") return <Navigate to="/admin" />;
    if (userRole === "base_commander") return <Navigate to="/commander" />;
    if (userRole === "logistics_officer") return <Navigate to="/dashboard" />;
    return <Navigate to="/" />;
  }
  return children;
};

export default ProtectedRoute;
