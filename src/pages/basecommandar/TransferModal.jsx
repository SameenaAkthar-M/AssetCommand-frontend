import React, { useEffect, useState } from "react";
import axios from "axios";
import "./basecommanderstyle.css";

const TransferModal = ({ assets = [], currentBaseId, onClose }) => {
  const [selectedAssetId, setSelectedAssetId] = useState("");
  const [toBaseId, setToBaseId] = useState("");
  const [quantity, setQuantity] = useState();
  const [bases, setBases] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!currentBaseId) return;
    const token = localStorage.getItem("token");
    axios
      .get("https://assetcommand.onrender.com/api/base/allbase", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const filteredBases = (res.data || []).filter(
          (b) => String(b._id) !== String(currentBaseId)
        );
        setBases(filteredBases);
      })
      .catch((err) => console.error(err));
  }, [currentBaseId]);

  useEffect(() => {
    if (selectedAssetId) {
      const asset = assets.find((a) => a._id === selectedAssetId);
      setQuantity(asset?.closingBalance || 0);
    }
  }, [selectedAssetId, assets]);

  const handleTransfer = async () => {
    if (!selectedAssetId || !toBaseId || !quantity) {
      return setError("Select asset, base, and quantity");
    }

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "https://assetcommand.onrender.com/api/dashboard/transfer",
        { assetId: selectedAssetId, toBaseId, quantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Transfer successful");
      onClose();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Transfer failed");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal transfer-modal">
        <h3 className="modal-title">Transfer Assets</h3>
        {error && <p className="modal-error">{error}</p>}

        <label className="modal-label">Asset:</label>
        {assets.length > 0 ? (
          <select
            className="modal-select"
            value={selectedAssetId}
            onChange={(e) => setSelectedAssetId(e.target.value)}
          >
            <option value="">Select Asset</option>
            {assets.map((a) => (
              <option key={a._id} value={a._id}>
                {a.name} ({a.type}) - Available: {a.closingBalance}
              </option>
            ))}
          </select>
        ) : (
          <p>No assets available</p>
        )}

        <label className="modal-label">To Base:</label>
        {bases.length > 0 ? (
          <select
            className="modal-select"
            value={toBaseId}
            onChange={(e) => setToBaseId(e.target.value)}
          >
            <option value="">Select Base</option>
            {bases.map((b) => (
              <option key={b._id} value={b._id}>
                {b.name}
              </option>
            ))}
          </select>
        ) : (
          <p>No other bases available</p>
        )}

        <label className="modal-label">Quantity:</label>
        <input
          className="modal-input"
          type="number"
          max={assets.find((a) => a._id === selectedAssetId)?.closingBalance || 0}
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
        />

        <div className="modal-actions">
          <button className="btn-primary" onClick={handleTransfer}>
            Transfer
          </button>
          <button className="btn-secondary" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default TransferModal;
