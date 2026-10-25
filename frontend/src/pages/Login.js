import React, { useState } from "react";
import api from "../api";
import Message from "../components/Message";

export default function Login({ onLogin, onShowRegister }) {
  const [email, setEmail] = useState("admin@example.com");
  const [password, setPassword] = useState("Admin123!");
  const [message, setMessage] = useState("");

  async function submit(e) {
    e.preventDefault();
    setMessage("");
    try {
      const response = await api.post("/users/login", { email, password });
      onLogin(response.data);
    } catch (error) {
      setMessage(error.response?.data?.message || "Login failed. Check that the backend is running.");
    }
  }

  return (
    <div className="container py-5" style={{ maxWidth: 480 }}>
      <div className="card page-card">
        <div className="card-body p-4">
          <h2 className="mb-3">Login</h2>
          <Message message={message} type="danger" />
          <form onSubmit={submit}>
            <label className="form-label">Email</label>
            <input className="form-control mb-3" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
            <label className="form-label">Password</label>
            <input className="form-control mb-3" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
            <button className="btn btn-primary w-100">Login</button>
          </form>
          <hr />
          <button className="btn btn-outline-secondary w-100" onClick={onShowRegister}>Create customer account</button>
          <p className="text-muted small mt-3 mb-0">First local admin: admin@example.com / Admin123!</p>
        </div>
      </div>
    </div>
  );
}
