import React, { useEffect, useState } from "react";
import axios from "axios";
import "../pages/basecommandar/basecommanderstyle.css";

const TransferHistoryModal = ({ baseId, onClose }) => {
  const [transfers, setTransfers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTransfers = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        "https://assetcommand.onrender.com/api/dashboard/transferhistory",
        {
          params: { baseId },
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setTransfers(res.data.transfers || []);
    } catch (err) {
      console.error("Error fetching transfers:", err);
      setTransfers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (baseId) fetchTransfers();
  }, [baseId]);

  return (
    <div className="modal-overlay">
      <div className="modal transfer-history-modal">
        <h3 className="modal-title">Transfer History</h3>
        {loading ? (
          <p>Loading transfer history...</p>
        ) : transfers.length === 0 ? (
          <p>No transfers found for this base.</p>
        ) : (
          <table className="modal-table">
            <thead>
              <tr>
                <th>Asset</th>
                <th>Type</th>
                <th>Quantity</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {transfers.map((t) => (
                <tr key={t._id}>
                  <td>{t.asset?.name}</td>
                  <td>{t.type === "transfer_in" ? "Received" : "Sent"}</td>
                  <td>{t.quantity}</td>
                  <td>{new Date(t.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <div className="modal-actions">
          <button className="btn-secondary btn-transfer-history" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default TransferHistoryModal;
