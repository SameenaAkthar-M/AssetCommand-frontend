import React, { useState, useEffect } from "react";
import "./basecommanderstyle.css";

const AssignModal = ({ asset, onClose, onSuccess }) => {
  const [bases, setBases] = useState([]);
  const [selectedBase, setSelectedBase] = useState("");
  const [quantity, setQuantity] = useState("");

  useEffect(() => {
    const fetchBases = async () => {
      try {
        const res = await fetch("https://assetcommand.onrender.com/api/base/allbase", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const data = await res.json();

        if (Array.isArray(data)) {
          setBases(data);
        } else if (Array.isArray(data.bases)) {
          setBases(data.bases);
        } else {
          console.error("Unexpected API response:", data);
        }
      } catch (err) {
        console.error("Error fetching bases:", err);
      }
    };

    fetchBases();
  }, []);

  const handleAssign = async () => {
    if (!selectedBase || !quantity) {
      alert("Please select a base and enter quantity");
      return;
    }

    try {
      const res = await fetch("https://assetcommand.onrender.com/api/dashboard/assign", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          assetId: asset._id,
          quantity: Number(quantity),
          baseId: selectedBase,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.message || "Failed to assign asset");
        return;
      }

      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      console.error("Assign error:", err.response?.data || err.message);
      alert("Assign failed: " + (err.response?.data?.message || "Server error"));
    }
  };

  return (
    <div className="modal-overlay assign-modal-overlay">
      <div className="modal assign-modal">
        <h3 className="modal-title">Assign Asset: {asset.name}</h3>

        <label className="modal-label">Assign To (Base)</label>
        <select
          className="modal-select"
          value={selectedBase}
          onChange={(e) => setSelectedBase(e.target.value)}
        >
          <option value="">-- Select Base --</option>
          {bases.map((base) => (
            <option key={base._id} value={base._id}>
              {base.name} - {base.location}
            </option>
          ))}
        </select>

        <label className="modal-label">Quantity</label>
        <input
          className="modal-input"
          type="number"
          placeholder="Enter quantity"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          max={asset.closingBalance}
        />

        <div className="modal-actions">
          <button className="btn-primary" onClick={handleAssign}>Assign</button>
          <button className="btn-secondary" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default AssignModal;
