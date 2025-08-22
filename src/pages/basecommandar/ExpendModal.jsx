import React from "react";
import "./basecommanderstyle.css";

const ExpendModal = ({ asset, onClose }) => {
  if (!asset) return null;

  const totalExpended = asset.openingBalance - asset.closingBalance;

  return (
    <div className="modal-overlay">
      <div className="modal expend-modal">
        <h3 className="modal-title">Consumption Details: {asset.name}</h3>
        <p className="modal-text">Opening Balance: {asset.openingBalance}</p>
        <p className="modal-text">Closing Balance: {asset.closingBalance}</p>
        <p className="modal-text">Total Expended: {totalExpended}</p>

        <div className="modal-actions">
          <button className="btn-secondary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExpendModal;
