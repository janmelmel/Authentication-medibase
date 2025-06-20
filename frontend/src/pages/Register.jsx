import { useState } from "react";
import axios from "axios";

function Register() {
    const [form, setForm] = useState({ name: "", email: "", password: "" });
    const [message, setMessage] = useState("");

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
        const res = await axios.post("http://localhost:5000/api/register", form);
            setMessage(res.data.message);
        } catch (err) {
            setMessage(err.response?.data?.message || "Something went wrong");
        }
    };

    return (
        <div style={{ padding: "20px" }}>
        <h2>Register</h2>
        <form onSubmit={handleSubmit}>
            <input
            name="name"
            placeholder="Name"
            onChange={handleChange}
            value={form.name}
            /><br /><br />
            <input
            name="email"
            placeholder="Email"
            onChange={handleChange}
            value={form.email}
            /><br /><br />
            <input
            name="password"
            type="password"
            placeholder="Password"
            onChange={handleChange}
            value={form.password}
            /><br /><br />
            <button type="submit">Register</button>
        </form>
            <p>{message}</p>
        </div>
    );
    }

    export default Register;