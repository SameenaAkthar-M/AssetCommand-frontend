import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./Dashboard.jsx";
import Purchases from "./PurchasePage.jsx";
import Transfers from "./TransfersPage.jsx";

const LogisticRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="asset" />} />
      <Route path="asset" element={<Dashboard />} />
      <Route path="purchases" element={<Purchases />} />
      <Route path="transfers" element={<Transfers />} />
      <Route path="*" element={<Navigate to="asset" />} />
    </Routes>
  );
};

export default LogisticRoutes;
