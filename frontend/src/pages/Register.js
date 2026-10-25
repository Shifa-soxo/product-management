import React, { useState } from "react";
import api from "../api";
import Message from "../components/Message";

export default function Register({ onRegistered, onBack }) {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [message, setMessage] = useState("");
  const [type, setType] = useState("danger");

  function change(e) { setForm({ ...form, [e.target.name]: e.target.value }); }

  async function submit(e) {
    e.preventDefault();
    setMessage("");
    try {
      await api.post("/users/register", form);
      setType("success");
      setMessage("Registration successful. Please log in.");
      setTimeout(onRegistered, 700);
    } catch (error) {
      setType("danger");
      setMessage(error.response?.data?.message || "Registration failed.");
    }
  }

  return (
    <div className="container py-5" style={{ maxWidth: 480 }}>
      <div className="card page-card"><div className="card-body p-4">
        <h2>Create customer account</h2>
        <Message message={message} type={type} />
        <form onSubmit={submit}>
          <label className="form-label">Name</label>
          <input className="form-control mb-3" name="name" value={form.name} onChange={change} required />
          <label className="form-label">Email</label>
          <input className="form-control mb-3" type="email" name="email" value={form.email} onChange={change} required />
          <label className="form-label">Password (minimum 8 characters)</label>
          <input className="form-control mb-3" type="password" name="password" minLength="8" value={form.password} onChange={change} required />
          <button className="btn btn-primary w-100">Register</button>
        </form>
        <button className="btn btn-link mt-2" onClick={onBack}>Back to login</button>
      </div></div>
    </div>
  );
}
