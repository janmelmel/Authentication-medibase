import { useEffect, useState } from "react";
import axios from "axios";
import "./../styles/global.css";

function UserDashboard() {
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    // Fetch user data
    const fetchUser = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/users/${userId}`);
        setUser(res.data);
        setForm({ name: res.data.name, email: res.data.email, password: "" });
      } catch {
        alert("Failed to load user profile");
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
      setEditMode(false);
      setUser({ ...user, name: form.name, email: form.email });
    } catch {
      alert("Update failed");
    }
  };

  if (!user) return <p>Loading...</p>;

  return (
    <div style={{ maxWidth: "500px", margin: "3rem auto" }}>
      <h2>Welcome, {user.name}</h2>

      {!editMode ? (
        <div>
          <p><strong>Email:</strong> {user.email}</p>
          <button onClick={() => setEditMode(true)}>Edit Profile</button>
        </div>
      ) : (
        <div>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Name"
            required
          />
          <input
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
            required
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
        </div>
      )}
    </div>
  );
}

export default UserDashboard;