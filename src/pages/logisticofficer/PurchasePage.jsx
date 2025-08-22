import React, { useEffect, useState } from "react";
import axios from "axios";
import "./dashboard.css";

const PurchasePage = () => {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filterBase, setFilterBase] = useState("All");
  const [filterAsset, setFilterAsset] = useState("All");
  const [filterStartDate, setFilterStartDate] = useState("");
  const [filterEndDate, setFilterEndDate] = useState("");

  const fetchPurchases = async () => {
    try {
      setLoading(true);
      const res = await axios.get("https://assetcommand.onrender.com/api/purchase/purchasehistory", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setPurchases(res.data.purchases);
    } catch (err) {
      console.error("Error fetching purchases:", err);
      setPurchases([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPurchases();
  }, []);

  const filteredPurchases = purchases.filter(p => {
    const baseMatch = filterBase === "All" || (p.base?.name === filterBase);
    const assetMatch = filterAsset === "All" || (p.asset?.name === filterAsset);
    const dateMatch =
      (!filterStartDate || new Date(p.date) >= new Date(filterStartDate)) &&
      (!filterEndDate || new Date(p.date) <= new Date(filterEndDate));
    return baseMatch && assetMatch && dateMatch;
  });

  const uniqueBases = ["All", ...new Set(purchases.map(p => p.base?.name || "N/A"))];
  const uniqueAssets = ["All", ...new Set(purchases.map(p => p.asset?.name || "N/A"))];

  if (loading) return <p className="loading-text purchases-loading">Loading purchases...</p>;
  if (purchases.length === 0) return <p className="loading-text purchases-empty">No purchases found.</p>;

  return (
    <div className="purchases-container">
      <h2 className="purchases-title">Purchases</h2>

      <div className="filter-container">
  <select
    className="filter-select base"
    value={filterBase}
    onChange={e => setFilterBase(e.target.value)}
  >
    {uniqueBases.map(base => <option key={base}>{base}</option>)}
  </select>

  <select
    className="filter-select asset"
    value={filterAsset}
    onChange={e => setFilterAsset(e.target.value)}
  >
    {uniqueAssets.map(asset => <option key={asset}>{asset}</option>)}
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

      <table className="purchases-table">
        <thead>
          <tr>
            <th>Asset</th>
            <th>Quantity</th>
            <th>Base</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {filteredPurchases.map(p => (
            <tr key={p._id}>
              <td>{p.asset?.name || "N/A"}</td>
              <td>{p.quantity}</td>
              <td>{p.base?.name || "N/A"}</td>
              <td>{new Date(p.date).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PurchasePage;
