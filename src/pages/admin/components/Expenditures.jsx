import React, { useEffect, useState } from "react";
import axios from "axios";
import "../admin.css"

const Expenditures = () => {
  const [expenditures, setExpenditures] = useState([]);
  const [assets, setAssets] = useState([]);
  const [bases, setBases] = useState([]);
  const [expenditureData, setExpenditureData] = useState({});
  const token = localStorage.getItem("token");
  const config = { headers: { Authorization: `Bearer ${token}` } };

  const fetchData = async () => {
    try {
      const [expRes, assetRes, baseRes] = await Promise.all([
        axios.get("https://assetcommand.onrender.com/api/admin/expenditure", config),
        axios.get("https://assetcommand.onrender.com/api/admin/asset", config),
        axios.get("https://assetcommand.onrender.com/api/admin/base", config)
      ]);
      setExpenditures(expRes.data.expenditures || []);
      setAssets(assetRes.data.assets || []);
      setBases(baseRes.data.bases || []);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddExpenditure = async () => {
    try {
      await axios.post("https://assetcommand.onrender.com/api/admin/expenditure", { ...expenditureData, date: new Date() }, config);
      setExpenditureData({});
      fetchData();
    } catch (err) {
      console.log(err);
    }
  };

  const handleDelete = async (id) => {
  try {
    await axios.delete(`https://assetcommand.onrender.com/api/admin/expenditure/${id}`, config);
    fetchData();
  } catch (err) {
    console.log(err);
  }
};


  const uniqueAssetNames = [...new Map(assets.map((a) => [a.name, a])).values()];

  return (
    <div className="admin-section">
      <h2>Expenditures</h2>
      <div className="form-container">
      <select name="asset" value={expenditureData.asset || ""} onChange={(e) => setExpenditureData({ ...expenditureData, [e.target.name]: e.target.value })}>
        <option value="">Select Asset</option>
        {uniqueAssetNames.map((a) => (<option key={a._id} value={a._id}>{a.name}</option>))}
      </select>
      <select name="base" value={expenditureData.base || ""} onChange={(e) => setExpenditureData({ ...expenditureData, [e.target.name]: e.target.value })}>
        <option value="">Select Base</option>
        {bases.map((b) => (<option key={b._id} value={b._id}>{b.name}</option>))}
      </select>
      <input type="number" placeholder="Quantity" name="quantity" value={expenditureData.quantity || ""} onChange={(e) => setExpenditureData({ ...expenditureData, [e.target.name]: e.target.value })} />
      <button onClick={handleAddExpenditure}>Add Expenditure</button>
      </div>

      <table border="1">
        <thead>
          <tr>
            <th>Asset</th>
            <th>Base</th>
            <th>Quantity</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {expenditures.map((e) => (
            <tr key={e._id}>
              <td>{e.asset?.name}</td>
              <td>{e.base?.name}</td>
              <td>{e.quantity}</td>
              <td>{new Date(e.date).toLocaleDateString()}</td>
              <td><button onClick={() => handleDelete(e._id)}>Delete</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Expenditures;
