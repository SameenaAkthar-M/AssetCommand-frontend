import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import MetricsCard from "../../components/MetricsCard";
import AssignModal from "./AssignModal";
import ExpendModal from "./ExpendModal";
import TransferModal from "./TransferModal";
import AssetTable from "./AssetTable";
import AssetForm from "./AssetForm";
import TransferHistoryModal from "../../components/TransferHistory";
import "./basecommanderstyle.css";

const assetTypes = ["Vehicle", "Weapon", "Ammunition", "Equipment"];

const BaseCommanderDashboard = () => {
  const [assets, setAssets] = useState([]);
  const [baseId, setBaseId] = useState("");
  const [baseName, setBaseName] = useState("");
  const [loading, setLoading] = useState(true);

  const [selectedAsset, setSelectedAsset] = useState(null);
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [expendModalOpen, setExpendModalOpen] = useState(false);
  const [transferModalOpen, setTransferModalOpen] = useState(false);
  const [assetFormOpen, setAssetFormOpen] = useState(false);

  const [showTransferHistory, setShowTransferHistory] = useState(false);
  const [showLogout, setShowLogout] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    if (userData?.role === "base_commander" && userData.base) {
      setBaseId(userData.base._id);
      setBaseName(userData.base.name);
    }
  }, []);

  useEffect(() => {
    if (baseId) fetchAssets();
  }, [baseId]);

  const fetchAssets = async () => {
    try {
      setLoading(true);
      const res = await axios.get("https://assetcommand.onrender.com/api/asset/allasset", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const baseAssets = res.data.assets.filter((a) => a.base?._id === baseId);
      setAssets(baseAssets);
    } catch (err) {
      console.error("Error fetching assets:", err.response || err);
      setAssets([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this asset?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`https://assetcommand.onrender.com/api/asset/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchAssets();
    } catch (err) {
      console.error(err);
      alert("Error deleting asset");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const totalOpening = assets.reduce((acc, a) => acc + a.openingBalance, 0);
  const totalClosing = assets.reduce((acc, a) => acc + a.closingBalance, 0);
  const netMovement = assets.reduce(
    (acc, a) => acc + Math.abs(a.closingBalance - a.openingBalance),
    0
  );

  return (
    <div className="dashboard-container">
      <div className="base-header">
        <h2 className="dashboard-title">
          Base Commander ({baseName || "Loading..."})
        </h2>

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

      {loading && <p className="loading-text">Loading assets...</p>}

      <div className="metrics-container">
        <MetricsCard className="metrics-card" title="Opening Balance" value={totalOpening} />
        <MetricsCard className="metrics-card" title="Closing Balance" value={totalClosing} />
        <MetricsCard className="metrics-card" title="Net Movement" value={netMovement} />
      </div>

      <div className="dashboard-actions">
        <button
          className="btn-primary"
          onClick={() => { setSelectedAsset(null); setAssetFormOpen(true); }}
        >
          Add Asset
        </button>

        <button
          className="btn-primary"
          onClick={() => setTransferModalOpen(true)}
        >
          Transfer Assets
        </button>

        {baseId && (
          <button
            className="btn-primary"
            onClick={() => setShowTransferHistory(!showTransferHistory)}
          >
            {showTransferHistory ? "Hide Transfer History" : "Show Transfer History"}
          </button>
        )}
      </div>

      {transferModalOpen && baseId && (
        <TransferModal
          assets={assets}
          currentBaseId={baseId}
          onClose={() => setTransferModalOpen(false)}
        />
      )}

      {showTransferHistory && baseId && (
        <TransferHistoryModal
          baseId={baseId}
          onClose={() => setShowTransferHistory(false)}
        />
      )}

      {assetTypes.map((type) => (
        <AssetTable
          key={type}
          className="asset-table-component"
          type={type}
          assets={assets}
          onAssign={(asset) => { setSelectedAsset(asset); setAssignModalOpen(true); }}
          onExpend={(asset) => { setSelectedAsset(asset); setExpendModalOpen(true); }}
          onEdit={(asset) => { setSelectedAsset(asset); setAssetFormOpen(true); }}
          onDelete={handleDelete}
        />
      ))}

      {assetFormOpen && (
        <AssetForm
          className="asset-form-modal"
          baseId={baseId}
          asset={selectedAsset}
          onSuccess={fetchAssets}
          onClose={() => setAssetFormOpen(false)}
        />
      )}

      {assignModalOpen && (
        <AssignModal
          className="assign-modal"
          asset={selectedAsset}
          onClose={() => setAssignModalOpen(false)}
          onSuccess={fetchAssets}
        />
      )}

      {expendModalOpen && (
        <ExpendModal
          className="expend-modal"
          asset={selectedAsset}
          onClose={() => setExpendModalOpen(false)}
          onSuccess={fetchAssets}
        />
      )}
    </div>
  );
};

export default BaseCommanderDashboard;
