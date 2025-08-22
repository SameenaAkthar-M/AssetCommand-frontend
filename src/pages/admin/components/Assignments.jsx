import React, { useEffect, useState } from "react";
import axios from "axios";
import "../admin.css"

const Assignments = () => {
  const [assignments, setAssignments] = useState([]);
  const [assets, setAssets] = useState([]);
  const [bases, setBases] = useState([]);
  const [assignmentData, setAssignmentData] = useState({});
  const token = localStorage.getItem("token");
  const config = { headers: { Authorization: `Bearer ${token}` } };

  const fetchData = async () => {
    try {
      const [assignRes, assetRes, baseRes] = await Promise.all([
        axios.get("https://assetcommand.onrender.com/api/admin/assignment", config),
        axios.get("https://assetcommand.onrender.com/api/admin/asset", config),
        axios.get("https://assetcommand.onrender.com/api/admin/base", config)
      ]);
      setAssignments(assignRes.data.assignments || []);
      setAssets(assetRes.data.assets || []);
      setBases(baseRes.data.bases || []);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddAssignment = async () => {
    try {
      const response = await axios.post(
  "https://assetcommand.onrender.com/api/admin/assignment",
  {
    assetId: assignmentData.asset,
    base: assignmentData.base,
    quantity: assignmentData.quantity,
    assignedTo: assignmentData.assignedTo
  },
  config
);
      setAssignmentData({});
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || "Something went wrong");
    }
  };

  const handleDelete = async (id) => {
  if (!window.confirm("Are you sure you want to delete this assignment?")) return;

  try {
    const res = await axios.delete(`https://assetcommand.onrender.com/api/admin/assignment/${id}`, config);
    alert(res.data.message);
    fetchData();
  } catch (err) {
    console.error("Delete error:", err.response?.data || err.message);
    alert(err.response?.data?.message || "Failed to delete assignment");
  }
};

  const uniqueAssetNames = [...new Map(assets.map((a) => [a.name, a])).values()];

  return (
    <div className="admin-section">
      <h2>Assignments</h2>
      <div className="form-container">
      <select name="asset" value={assignmentData.asset || ""} onChange={(e) => setAssignmentData({ ...assignmentData, [e.target.name]: e.target.value })}>
        <option value="">Select Asset</option>
        {uniqueAssetNames.map((a) => (<option key={a._id} value={a._id}>{a.name}</option>))}
      </select>
      <select name="base" value={assignmentData.base || ""} onChange={(e) => setAssignmentData({ ...assignmentData, [e.target.name]: e.target.value })}>
        <option value="">Select Base</option>
        {bases.map((b) => (<option key={b._id} value={b._id}>{b.name}</option>))}
      </select>
      <input type="number" placeholder="Quantity" name="quantity" value={assignmentData.quantity || ""} onChange={(e) => setAssignmentData({ ...assignmentData, [e.target.name]: e.target.value })} />
      <button onClick={handleAddAssignment}>Add Assignment</button>
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
          {assignments.map((a) => (
            <tr key={a._id}>
              <td>{a.asset?.name}</td>
              <td>{a.base?.name}</td>
              <td>{a.quantity}</td>
              <td>{new Date(a.date).toLocaleDateString()}</td>
              <td><button onClick={() => handleDelete(a._id)}>Delete</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Assignments;
