import React, { useState, useEffect } from "react";
import axios from "axios";
import "./basecommanderstyle.css";

const AssetForm = ({ baseId, asset, onSuccess, onClose }) => {
  const [name, setName] = useState(asset?.name || "");
  const [type, setType] = useState(asset?.type || "Vehicle");
  const [openingBalance, setOpeningBalance] = useState(asset?.openingBalance);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (asset) {
        await axios.put(
          `https://assetcommand.onrender.com/api/asset/${asset._id}`,
          { name, type, openingBalance },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        await axios.post(
          `https://assetcommand.onrender.com/api/asset/create`,
          { name, type, openingBalance, base: baseId },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      alert("Error saving asset");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal asset-form-modal">
        <h3>{asset ? "Edit Asset" : "Add Asset"}</h3>
        <form onSubmit={handleSubmit} className="asset-form">
          <label className="form-label">Name:</label>
          <input
            className="form-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <label className="form-label">Type:</label>
          <select
            className="form-select"
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <option>Vehicle</option>
            <option>Weapon</option>
            <option>Ammunition</option>
            <option>Equipment</option>
          </select>

          <label className="form-label">Opening Balance:</label>
          <input
            className="form-input"
            type="number"
            value={openingBalance}
            onChange={(e) => setOpeningBalance(Number(e.target.value))}
            required
          />

          <div className="form-actions">
            <button type="submit" className="btn-primary">
              {asset ? "Update" : "Add"} Asset
            </button>
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AssetForm;
