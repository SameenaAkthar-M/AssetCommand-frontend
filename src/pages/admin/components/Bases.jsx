import React, { useEffect, useState } from "react";
import axios from "axios";

const Bases = () => {
  const [bases, setBases] = useState([]);
  const [baseData, setBaseData] = useState({});

  const token = localStorage.getItem("token");
  const config = { headers: { Authorization: `Bearer ${token}` } };
  const fetchBases = async () => {
    try {
      const res = await axios.get("https://assetcommand.onrender.com/api/admin/base", config);
      setBases(res.data.bases || []);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    fetchBases();
  }, []);
  const handleAddBase = async () => {
    try {
      await axios.post("https://assetcommand.onrender.com/api/admin/base", baseData, config);
      setBaseData({});
      fetchBases();
    } catch (err) {
      console.log(err);
    }
  };
  const handleDeleteBase = async (id) => {
    try {
      await axios.delete(`https://assetcommand.onrender.com/api/admin/base/${id}`, config);
      fetchBases();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="admin-section">
      <h2>Bases</h2>
      
      <div className="form-container">
        <input
          placeholder="Name"
          name="name"
          value={baseData.name || ""}
          onChange={(e) => setBaseData({ ...baseData, [e.target.name]: e.target.value })}
        />
        <input
          placeholder="Location"
          name="location"
          value={baseData.location || ""}
          onChange={(e) => setBaseData({ ...baseData, [e.target.name]: e.target.value })}
        />
        <button onClick={handleAddBase}>Add Base</button>
      </div>

      <table border="1">
        <thead>
          <tr>
            <th>Name</th>
            <th>Location</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {bases.map((b) => (
            <tr key={b._id}>
              <td>{b.name}</td>
              <td>{b.location}</td>
              <td>
                <button onClick={() => handleDeleteBase(b._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Bases;
