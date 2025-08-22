import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import SignIn from "./components/SignIn.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import LogisticRoutes from "./pages/logisticofficer/LogisticRoutes.jsx";
import BaseCommanderDashboard from "./pages/basecommandar/BaseCommanderDashboard.jsx";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute role="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/*"
          element={
            <ProtectedRoute role="logistics_officer">
              <LogisticRoutes />
            </ProtectedRoute>
          }
        />
        <Route
          path="/commander"
          element={
            <ProtectedRoute role="base_commander">
              <BaseCommanderDashboard />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;
