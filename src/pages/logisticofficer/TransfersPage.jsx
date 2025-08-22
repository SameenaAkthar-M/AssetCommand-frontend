import React, { useEffect, useState } from "react";
import axios from "axios";
import "./dashboard.css";

const TransfersPage = () => {
  const [transfers, setTransfers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filterFromBase, setFilterFromBase] = useState("All");
  const [filterToBase, setFilterToBase] = useState("All");
  const [filterAsset, setFilterAsset] = useState("All");
  const [filterStartDate, setFilterStartDate] = useState("");
  const [filterEndDate, setFilterEndDate] = useState("");

  const fetchTransfers = async () => {
    try {
      setLoading(true);
      const res = await axios.get("https://assetcommand.onrender.com/api/transfer/alltransfer", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setTransfers(res.data.transfers || []);
    } catch (err) {
      console.error("Error fetching transfers:", err);
      setTransfers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransfers();
  }, []);

  const filteredTransfers = transfers.filter(t => {
    const fromBaseMatch = filterFromBase === "All" || (t.fromBase?.name === filterFromBase);
    const toBaseMatch = filterToBase === "All" || (t.toBase?.name === filterToBase);
    const assetMatch = filterAsset === "All" || (t.asset?.name === filterAsset);
    const dateMatch =
      (!filterStartDate || new Date(t.createdAt) >= new Date(filterStartDate)) &&
      (!filterEndDate || new Date(t.createdAt) <= new Date(filterEndDate));
    return fromBaseMatch && toBaseMatch && assetMatch && dateMatch;
  });

  const uniqueFromBases = ["All", ...new Set(transfers.map(t => t.fromBase?.name || "N/A"))];
  const uniqueToBases = ["All", ...new Set(transfers.map(t => t.toBase?.name || "N/A"))];
  const uniqueAssets = ["All", ...new Set(transfers.map(t => t.asset?.name || "N/A"))];

  if (loading) return <p className="loading-text transfers-loading">Loading transfers...</p>;
  if (transfers.length === 0) return <p className="loading-text transfers-empty">No transfers found.</p>;

  return (
    <div className="transfers-container">
      <h2 className="transfers-title">Transfers</h2>

      <div className="filter-container">
  <select
    className="filter-select from-base"
    value={filterFromBase}
    onChange={e => setFilterFromBase(e.target.value)}
  >
    {uniqueFromBases.map(b => <option key={b}>{b}</option>)}
  </select>

  <select
    className="filter-select to-base"
    value={filterToBase}
    onChange={e => setFilterToBase(e.target.value)}
  >
    {uniqueToBases.map(b => <option key={b}>{b}</option>)}
  </select>

  <select
    className="filter-select asset"
    value={filterAsset}
    onChange={e => setFilterAsset(e.target.value)}
  >
    {uniqueAssets.map(a => <option key={a}>{a}</option>)}
  </select>

  <input
    type="date"
    className="filter-date start-date"
    value={filterStartDate}
    onChange={e => setFilterStartDate(e.target.value)}
  />

  <input
    type="date"
    className="filter-date end-date"
    value={filterEndDate}
    onChange={e => setFilterEndDate(e.target.value)}
  />
</div>

      <table className="transfers-table">
        <thead>
          <tr>
            <th>Asset</th>
            <th>From Base</th>
            <th>To Base</th>
            <th>Quantity</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {filteredTransfers.map(t => (
            <tr key={t._id}>
              <td>{t.asset?.name || "N/A"}</td>
              <td>{t.fromBase?.name || "N/A"}</td>
              <td>{t.toBase?.name || "N/A"}</td>
              <td>{t.quantity}</td>
              <td>{new Date(t.createdAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransfersPage;
