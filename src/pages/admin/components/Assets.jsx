import React, { useEffect, useState } from "react";
import axios from "axios";
import "../admin.css"

const Assets = () => {
  const [assets, setAssets] = useState([]);
  const [bases, setBases] = useState([]);
  const [assetData, setAssetData] = useState({});
  const [editingAsset, setEditingAsset] = useState(null);

  const token = localStorage.getItem("token");
  const config = { headers: { Authorization: `Bearer ${token}` } };

  const fetchAssets = async () => {
    try {
      const [assetRes, baseRes] = await Promise.all([
        axios.get("https://assetcommand.onrender.com/api/admin/asset", config),
        axios.get("https://assetcommand.onrender.com/api/admin/base", config),
      ]);
      setAssets(assetRes.data.assets || []);
      setBases(baseRes.data.bases || []);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to fetch assets");
    }
  };

  useEffect(() => {
    if (!token) {
      alert("You are not logged in or session expired");
      return;
    }
    fetchAssets();
  }, [token]);

  const handleAddAsset = async () => {
    try {
      if (!assetData.name || !assetData.type || !assetData.base || assetData.openingBalance === undefined) {
        alert("All fields are required");
        return;
      }
      await axios.post("https://assetcommand.onrender.com/api/admin/asset", assetData, config);
      setAssetData({});
      fetchAssets();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to add asset");
    }
  };

  const handleEditAsset = (asset) => {
    setEditingAsset(asset._id);
    setAssetData({
      name: asset.name,
      type: asset.type,
      base: asset.base?._id,
      openingBalance: asset.openingBalance,
      closingBalance: asset.closingBalance,
    });
  };

  const handleUpdateAsset = async (id) => {
    try {
      await axios.put(`https://assetcommand.onrender.com/api/admin/asset/${id}`, assetData, config);
      setEditingAsset(null);
      setAssetData({});
      fetchAssets();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to update asset");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://assetcommand.onrender.com/api/admin/asset/${id}`, config);
      fetchAssets();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to delete asset");
    }
  };

  return (
    <div className="admin-section">
      <h2>Assets</h2>
      <div className="form-container">
      <input placeholder="Name" name="name" value={assetData.name || ""} onChange={(e) => setAssetData({ ...assetData, [e.target.name]: e.target.value })} />
      <select name="type" value={assetData.type || ""} onChange={(e) => setAssetData({ ...assetData, [e.target.name]: e.target.value })}>
        <option value="">Select Type</option>
        <option value="Vehicle">Vehicle</option>
        <option value="Weapon">Weapon</option>
        <option value="Ammunition">Ammunition</option>
        <option value="Equipment">Equipment</option>
      </select>
      <select name="base" value={assetData.base || ""} onChange={(e) => setAssetData({ ...assetData, [e.target.name]: e.target.value })}>
        <option value="">Select Base</option>
        {bases.map(b => <option key={b._id} value={b._id}>{b.name}</option>)}
      </select>
      <input type="number" placeholder="Opening Balance" name="openingBalance" value={assetData.openingBalance || ""} onChange={(e) => setAssetData({ ...assetData, [e.target.name]: e.target.value })} />
      <input type="number" placeholder="Closing Balance" name="closingBalance" value={assetData.closingBalance || ""} onChange={(e) => setAssetData({ ...assetData, [e.target.name]: e.target.value })} />

      {editingAsset ? <button onClick={() => handleUpdateAsset(editingAsset)}>Update</button> : <button onClick={handleAddAsset}>Add Asset</button>}
      </div>

      <table border="1">
        <thead>
          <tr>
            <th>Name</th>
            <th>Type</th>
            <th>Base</th>
            <th>Opening</th>
            <th>Closing</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {assets.map(a => (
            <tr key={a._id}>
              <td>{a.name}</td>
              <td>{a.type}</td>
              <td>{a.base?.name}</td>
              <td>{a.openingBalance}</td>
              <td>{a.closingBalance}</td>
              <td>
                <button onClick={() => handleEditAsset(a)}>Edit</button>
                <button onClick={() => handleDelete(a._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Assets;
