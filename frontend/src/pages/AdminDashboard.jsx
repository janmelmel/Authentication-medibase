import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState("");
  const [editUserId, setEditUserId] = useState(null);
  const [editedData, setEditedData] = useState({});
  const navigate = useNavigate();

  // 🔒 Redirect if not admin
  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    const role = localStorage.getItem("role");
    if (!isLoggedIn || role !== "admin") {
      navigate("/login");
    } else {
      fetchUsers();
    }
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/users?role=admin");
      setUsers(res.data);
    } catch (err) {
      setMessage("Failed to load users");
    }
  };

  const deleteUser = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/users/${id}?role=admin`);
      setMessage("User deleted");
      fetchUsers();
    } catch (err) {
      setMessage("Delete failed");
    }
  };

  const startEdit = (user) => {
    setEditUserId(user._id);
    setEditedData({
      name: user.name,
      email: user.email,
      password: "", // optional new password
    });
  };

  const cancelEdit = () => {
    setEditUserId(null);
    setEditedData({});
  };

  const confirmEdit = async (id) => {
    const payload = {
      name: editedData.name,
      email: editedData.email,
      userIdFromClient: id,
    };

    if (editedData.password && editedData.password.trim() !== "") {
      payload.password = editedData.password;
    }

    try {
      await axios.put(`http://localhost:5000/api/users/${id}`, payload);
      setMessage("User updated");
      setEditUserId(null);
      fetchUsers();
    } catch (err) {
      console.error("❌ Frontend error:", err);
      setMessage("Update failed");
    }
  };

  const handleChange = (e) => {
    setEditedData({ ...editedData, [e.target.name]: e.target.value });
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div style={{ padding: "20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2>Admin Dashboard</h2>
        <button onClick={handleLogout}>Logout</button>
      </div>

      {message && <p>{message}</p>}

      <table border="1" cellPadding="8" style={{ width: "100%", marginTop: "20px" }}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u._id}>
              <td>
                {editUserId === u._id ? (
                  <input
                    name="name"
                    value={editedData.name}
                    onChange={handleChange}
                  />
                ) : (
                  u.name
                )}
              </td>
              <td>
                {editUserId === u._id ? (
                  <input
                    name="email"
                    value={editedData.email}
                    onChange={handleChange}
                  />
                ) : (
                  u.email
                )}
              </td>
              <td>{u.role}</td>
              <td>
                {editUserId === u._id ? (
                  <>
                    <button onClick={() => confirmEdit(u._id)}>Confirm</button>
                    <button onClick={cancelEdit}>Cancel</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => startEdit(u)}>Edit</button>
                    <button onClick={() => deleteUser(u._id)}>Delete</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminDashboard;
