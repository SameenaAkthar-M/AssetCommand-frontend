import React, { useState, useEffect } from "react";
import axios from "axios";
import MetricsCard from "../../components/MetricsCard";
import LogisticTable from "./LogisticTable";
import TransferHistory from "./TransfersPage";
import Purchases from "./PurchasePage";
import "./dashboard.css";
import { useNavigate } from "react-router-dom";

const LogisticDashboard = () => {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showLogout, setShowLogout] = useState(false);

  const [filterBase, setFilterBase] = useState("All");
  const [filterType, setFilterType] = useState("All");

  const navigate = useNavigate();

  const fetchAssets = async () => {
    try {
      setLoading(true);
      const res = await axios.get("https://assetcommand.onrender.com/api/asset/allasset", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setAssets(res.data.assets || []);
    } catch (err) {
      console.error("Error fetching assets:", err);
      setAssets([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssets();
  }, []);

  // Apply filters
  const filteredAssets = assets.filter((a) => {
    const baseMatch = filterBase === "All" || a.base?.name === filterBase;
    const typeMatch = filterType === "All" || a.type === filterType;
    return baseMatch && typeMatch;
  });

  const totalOpening = filteredAssets.reduce(
    (acc, a) => acc + a.openingBalance,
    0
  );
  const totalClosing = filteredAssets.reduce(
    (acc, a) => acc + a.closingBalance,
    0
  );
  const netMovement = filteredAssets.reduce(
    (acc, a) => acc + Math.abs(a.closingBalance - a.openingBalance),
    0
  );

  const assetsByBase = filteredAssets.reduce((acc, a) => {
    const baseName = a.base?.name || "No Base";
    if (!acc[baseName]) acc[baseName] = [];
    acc[baseName].push(a);
    return acc;
  }, {});

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const uniqueBases = [
    "All",
    ...new Set(assets.map((a) => a.base?.name || "No Base")),
  ];
  const uniqueTypes = ["All", ...new Set(assets.map((a) => a.type))];

  return (
    <div className="logistic-dashboard-container">
      <div className="logistic-header">
        <h1 className="logistic-dashboard-header">Logistics Officer</h1>

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

      <div className="logistic-navbar">
        {["dashboard", "purchases", "transfers"].map((tab) => (
          <button
            key={tab}
            className={activeTab === tab ? "active" : ""}
            onClick={() => setActiveTab(tab)}
          >
            {tab === "dashboard"
              ? "Assets"
              : tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {activeTab === "dashboard" && (
        <>
          <div className="filter-container dashboard-filters">
            <select
              className="filter-select base"
              value={filterBase}
              onChange={(e) => setFilterBase(e.target.value)}
            >
              {uniqueBases.map((base) => (
                <option key={base}>{base}</option>
              ))}
            </select>

            <select
              className="filter-select type"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              {uniqueTypes.map((type) => (
                <option key={type}>{type}</option>
              ))}
            </select>
          </div>

          <div className="logistic-section">
            <div className="metrics-row">
              <MetricsCard title="Opening Balance" value={totalOpening} />
              <MetricsCard title="Closing Balance" value={totalClosing} />
              <MetricsCard title="Net Movement" value={netMovement} />
            </div>
          </div>

          <div className="logistic-section">
            {loading && <p className="loading-text">Loading assets...</p>}
            {!loading &&
              Object.keys(assetsByBase).map((baseName) => (
                <LogisticTable
                  key={baseName}
                  baseName={baseName}
                  assets={assetsByBase[baseName]}
                />
              ))}
            {!loading && filteredAssets.length === 0 && (
              <p className="loading-text">No assets available.</p>
            )}
          </div>
        </>
      )}

      {activeTab === "purchases" && <Purchases />}
      {activeTab === "transfers" && <TransferHistory />}
    </div>
  );
};

export default LogisticDashboard;
