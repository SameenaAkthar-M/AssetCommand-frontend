import React from "react";

const LogisticTable = ({ baseName, assets }) => {
  return (
    <div className="logistic-table-container">
      <h3 className="base-title">{baseName}</h3>
      <table className="logistic-table">
        <thead>
          <tr>
            <th>Asset Name</th>
            <th>Type</th>
            <th>Opening Balance</th>
            <th>Closing Balance</th>
          </tr>
        </thead>
        <tbody>
          {assets.map((a) => (
            <tr key={a._id}>
              <td>{a.name}</td>
              <td>{a.type}</td>
              <td>{a.openingBalance}</td>
              <td>{a.closingBalance}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LogisticTable;
