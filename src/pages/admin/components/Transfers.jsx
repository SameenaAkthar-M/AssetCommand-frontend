import React, { useEffect, useState } from "react";
import axios from "axios";
import "../admin.css"

const Transfers = () => {
  const [transfers, setTransfers] = useState([]);
  const [assets, setAssets] = useState([]);
  const [bases, setBases] = useState([]);
  const [transferData, setTransferData] = useState({});
  const token = localStorage.getItem("token");
  const config = { headers: { Authorization: `Bearer ${token}` } };

  const fetchData = async () => {
    try {
      const [transferRes, assetRes, baseRes] = await Promise.all([
        axios.get("https://assetcommand.onrender.com/api/admin/transfer", config),
        axios.get("https://assetcommand.onrender.com/api/admin/asset", config),
        axios.get("https://assetcommand.onrender.com/api/admin/base", config)
      ]);
      setTransfers(transferRes.data.transfers || []);
      setAssets(assetRes.data.assets || []);
      setBases(baseRes.data.bases || []);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddTransfer = async () => {
  if (!transferData.asset || !transferData.fromBase || !transferData.toBase || !transferData.quantity) {
    alert("Please fill all fields");
    return;
  }

  try {
    const payload = {
      assetId: transferData.asset,
      fromBase: transferData.fromBase,
      toBase: transferData.toBase,
      quantity: Number(transferData.quantity),
    };

    await axios.post("https://assetcommand.onrender.com/api/admin/transfer", payload, config);
    setTransferData({});
    fetchData();
  } catch (err) {
    console.log(err);
  }
};


  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://assetcommand.onrender.com/api/admin/transfer/${id}`, config);
      fetchData();
    } catch (err) {
      console.log(err);
    }
  };

  const uniqueAssetNames = [...new Map(assets.map((a) => [a.name, a])).values()];

  return (
    <div className="admin-section">
      <h2>Transfers</h2>
      <div className="form-container">
      <select name="asset" value={transferData.asset || ""} onChange={(e) => setTransferData({ ...transferData, [e.target.name]: e.target.value })}>
        <option value="">Select Asset</option>
        {uniqueAssetNames.map((a) => (<option key={a._id} value={a._id}>{a.name}</option>))}
      </select>
      <select name="fromBase" value={transferData.fromBase || ""} onChange={(e) => setTransferData({ ...transferData, [e.target.name]: e.target.value })}>
        <option value="">From Base</option>
        {bases.map((b) => (<option key={b._id} value={b._id}>{b.name}</option>))}
      </select>
      <select name="toBase" value={transferData.toBase || ""} onChange={(e) => setTransferData({ ...transferData, [e.target.name]: e.target.value })}>
        <option value="">To Base</option>
        {bases.map((b) => (<option key={b._id} value={b._id}>{b.name}</option>))}
      </select>
      <input type="number" placeholder="Quantity" name="quantity" value={transferData.quantity || ""} onChange={(e) => setTransferData({ ...transferData, [e.target.name]: e.target.value })} />
      <button onClick={handleAddTransfer}>Add Transfer</button>
      </div>

      <table border="1">
        <thead>
          <tr>
            <th>Asset</th>
            <th>From Base</th>
            <th>To Base</th>
            <th>Quantity</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {transfers.map((t) => (
            <tr key={t._id}>
              <td>{t.asset?.name}</td>
              <td>{t.fromBase?.name}</td>
              <td>{t.toBase?.name}</td>
              <td>{t.quantity}</td>
              <td>{new Date(t.date).toLocaleDateString()}</td>
              <td><button onClick={() => handleDelete(t._id)}>Delete</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Transfers;
