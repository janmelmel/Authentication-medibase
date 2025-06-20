import { useEffect, useState } from "react";
import axios from "axios";

function Dashboard() {
  const userId = localStorage.getItem("userId");
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/users/${userId}`);
        setUser(res.data);
        setForm({ name: res.data.name, email: res.data.email, password: "" });
      } catch {
        alert("Failed to load user");
      }
    };
    fetchUser();
  }, [userId]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`http://localhost:5000/api/users/${userId}`, {
        ...form,
        userIdFromClient: userId,
      });
      alert("Profile updated");
      setUser({ ...user, name: form.name, email: form.email });
      setEditMode(false);
    } catch {
      alert("Update failed");
    }
  };

  const logout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  return (
    <div style={{ maxWidth: "500px", margin: "3rem auto" }}>
      <h2>Dashboard</h2>
      <p>Welcome to the protected area!</p>

      {user && !editMode && (
        <>
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <button onClick={() => setEditMode(true)} style={{ marginRight: "10px" }}>
            Edit Profile
          </button>
          <button onClick={logout}>Logout</button>
        </>
      )}

      {editMode && (
        <>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Name"
          />
          <input
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
          />
          <input
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            placeholder="New Password (leave blank to keep current)"
          />
          <div style={{ marginTop: "1rem" }}>
            <button onClick={handleUpdate} style={{ marginRight: "10px" }}>
              Save
            </button>
            <button onClick={() => setEditMode(false)}>Cancel</button>
          </div>
        </>
      )}
    </div>
  );
}

export default Dashboard;
