import React, { useEffect, useState } from "react";
import axios from "axios";
import "../admin.css"

const Users = () => {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
    base: ""
  });
  const [bases, setBases] = useState([]);
  const [editingUserId, setEditingUserId] = useState(null);
  const token = localStorage.getItem("token");
  const config = { headers: { Authorization: `Bearer ${token}` } };
  const fetchUsers = async () => {
    try {
      const res = await axios.get("https://assetcommand.onrender.com/api/admin/users", config);
      setUsers(res.data.users || []);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };
  const fetchBases = async () => {
    try {
      const res = await axios.get("https://assetcommand.onrender.com/api/admin/base", config);
      setBases(res.data.bases || []);
    } catch (err) {
      console.error("Error fetching bases:", err);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchBases();
  }, []);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newUser.role === "base_commander" && !newUser.base) {
      alert("Please select a base for Base Commander");
      return;
    }
    try {
      if (editingUserId) {
        await axios.put(
          `https://assetcommand.onrender.com/api/admin/users/${editingUserId}/role`,
          { role: newUser.role },
          config
        );
        setEditingUserId(null);
      } else {
        await axios.post(
          "https://assetcommand.onrender.com/api/admin/users/create",
          newUser,
          config
        );
      }
      setNewUser({ name: "", email: "", password: "", role: "", base: "" });
      fetchUsers();
    } catch (err) {
      console.error("Error:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Something went wrong");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await axios.delete(`https://assetcommand.onrender.com/api/admin/users/${id}`, config);
      fetchUsers();
    } catch (err) {
      console.error("Error deleting user:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Something went wrong");
    }
  };
  const handleEdit = (user) => {
    setEditingUserId(user._id);
    setNewUser({
      name: user.name,
      email: user.email,
      password: "",
      role: user.role,
      base: user.base?._id || ""
    });
  };

  return (
    <div className="admin-section">
      <h2>Users</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-container">
        <input
          type="text"
          placeholder="Name"
          value={newUser.name}
          onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
          required={!editingUserId}
          disabled={editingUserId}
        />
        <input
          type="email"
          placeholder="Email"
          value={newUser.email}
          onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
          required={!editingUserId}
          disabled={editingUserId}
        />
        {!editingUserId && (
          <input
            type="password"
            placeholder="Password"
            value={newUser.password}
            onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
            required
          />
        )}
        <select
          value={newUser.role}
          onChange={(e) =>
            setNewUser({
              ...newUser,
              role: e.target.value,
              base: e.target.value === "base_commander" ? "" : null
            })
          }
          required
        >
          <option value="">Select Role</option>
          <option value="base_commander">Base Commander</option>
          <option value="logistics_officer">Logistic Officer</option>
        </select>
        

        {newUser.role === "base_commander" && bases.length > 0 && (
          <select
            value={newUser.base}
            onChange={(e) => setNewUser({ ...newUser, base: e.target.value })}
            required
          >
            <option value="">Select Base</option>
            {bases.map((b) => (
              <option key={b._id} value={b._id}>
                {b.name}
              </option>
            ))}
          </select>
        )}

        <button type="submit">{editingUserId ? "Update User" : "Add User"}</button>
        {editingUserId && (
          <button
            type="button"
            onClick={() => {
              setEditingUserId(null);
              setNewUser({ name: "", email: "", password: "", role: "", base: "" });
            }}
          >
            Cancel
          </button>
        )}
        </div>
      </form>

      <table border="1" style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Base</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>{user.base ? user.base.name || "-" : "-"}</td>
              <td>
                <button onClick={() => handleEdit(user)}>Edit</button>
                <button onClick={() => handleDelete(user._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Users;
