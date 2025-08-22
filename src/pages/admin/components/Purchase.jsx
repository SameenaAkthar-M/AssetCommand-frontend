import React, { useEffect, useState } from "react";
import axios from "axios";
import "../admin.css"

const Purchase = () => {
  const [assets, setAssets] = useState([]);
  const [bases, setBases] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [purchaseData, setPurchaseData] = useState({
    assetId: "",
    base: "",
    quantity: "",
  });

  const token = localStorage.getItem("token");
  const config = { headers: { Authorization: `Bearer ${token}` } };
  const fetchAll = async () => {
    try {
      const [assetRes, baseRes, purchaseRes] = await Promise.all([
        axios.get("https://assetcommand.onrender.com/api/admin/asset", config),
        axios.get("https://assetcommand.onrender.com/api/admin/base", config),
        axios.get("https://assetcommand.onrender.com/api/admin/purchase", config),
      ]);

      setAssets(assetRes.data.assets || []);
      setBases(baseRes.data.bases || []);
      setPurchases(purchaseRes.data.purchases || []);
    } catch (err) {
      console.log(err.response?.data || err.message);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const handleAddPurchase = async () => {
    if (!purchaseData.assetId || !purchaseData.base || !purchaseData.quantity) {
      alert("All fields are required");
      return;
    }

    try {
      await axios.post(
        "https://assetcommand.onrender.com/api/admin/purchase",
        {
          assetId: purchaseData.assetId,
          base: purchaseData.base,
          quantity: Number(purchaseData.quantity),
        },
        config
      );

      setPurchaseData({ assetId: "", base: "", quantity: "" });
      fetchAll();
    } catch (err) {
      console.log(err.response?.data || err.message);
      alert(err.response?.data?.message || "Error adding purchase");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://assetcommand.onrender.com/api/admin/purchase/${id}`, config);
      fetchAll();
    } catch (err) {
      console.log(err.response?.data || err.message);
      alert("Error deleting purchase");
    }
  };
  const uniqueAssetNames = [...new Map(assets.map((a) => [a.name, a])).values()];

  return (
    <div className="admin-section">
      <h2>Purchases</h2>

      <div className="form-container">
        <select
          name="assetId"
          value={purchaseData.assetId}
          onChange={(e) =>
            setPurchaseData({ ...purchaseData, [e.target.name]: e.target.value })
          }
        >
          <option value="">Select Asset</option>
          {uniqueAssetNames.map((a) => (
            <option key={a._id} value={a._id}>
              {a.name}
            </option>
          ))}
        </select>

        <select
          name="base"
          value={purchaseData.base}
          onChange={(e) =>
            setPurchaseData({ ...purchaseData, [e.target.name]: e.target.value })
          }
        >
          <option value="">Select Base</option>
          {bases.map((b) => (
            <option key={b._id} value={b._id}>
              {b.name}
            </option>
          ))}
        </select>

        <input
          type="number"
          name="quantity"
          placeholder="Quantity"
          value={purchaseData.quantity}
          onChange={(e) =>
            setPurchaseData({ ...purchaseData, [e.target.name]: e.target.value })
          }
        />

        <button onClick={handleAddPurchase}>Add Purchase</button>
      </div>

      <table border="1" style={{ width: "100%", textAlign: "center" }}>
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
          {purchases.length === 0 ? (
            <tr>
              <td colSpan="5">No purchases found</td>
            </tr>
          ) : (
            purchases.map((p) => (
              <tr key={p._id}>
                <td>{p.asset?.name}</td>
                <td>{p.base?.name}</td>
                <td>{p.quantity}</td>
                <td>{new Date(p.createdAt).toLocaleString()}</td>
                <td>
                  <button onClick={() => handleDelete(p._id)}>Delete</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Purchase;
