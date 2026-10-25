import React, { useEffect, useState } from "react";
import api from "../api";
import Message from "../components/Message";

export default function Staff() {
  const blank = { name: "", email: "", password: "" };
  const [staff, setStaff] = useState([]);
  const [form, setForm] = useState(blank);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");
  const [type, setType] = useState("success");

  async function load() {
    try { setStaff((await api.get("/users/staff")).data); }
    catch (error) { setMessage(error.response?.data?.message || "Could not load staff."); setType("danger"); }
  }
  useEffect(() => { load(); }, []);
  function change(e) { setForm({ ...form, [e.target.name]: e.target.value }); }

  async function save(e) {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/users/staff/${editingId}`, { name: form.name, email: form.email });
        setMessage("Staff updated.");
      } else {
        await api.post("/users/staff", form);
        setMessage("Staff added.");
      }
      setType("success"); setForm(blank); setEditingId(null); load();
    } catch (error) {
      setMessage(error.response?.data?.message || "Could not save staff."); setType("danger");
    }
  }

  async function remove(id) {
    if (!window.confirm("Delete this staff account?")) return;
    try { await api.delete(`/users/staff/${id}`); setMessage("Staff deleted."); setType("success"); load(); }
    catch (error) { setMessage(error.response?.data?.message || "Could not delete staff."); setType("danger"); }
  }

  return <div className="container py-4">
    <h2>Manage Staff</h2><Message message={message} type={type} />
    <div className="card page-card mb-4"><div className="card-body">
      <h5>{editingId ? "Update staff" : "Add staff"}</h5>
      <form className="row g-2" onSubmit={save}>
        <div className="col-md-4"><input className="form-control" placeholder="Name" name="name" value={form.name} onChange={change} required /></div>
        <div className="col-md-4"><input className="form-control" placeholder="Email" type="email" name="email" value={form.email} onChange={change} required /></div>
        {!editingId && <div className="col-md-3"><input className="form-control" placeholder="Password (8+ characters)" type="password" minLength="8" name="password" value={form.password} onChange={change} required /></div>}
        <div className="col-md-1"><button className="btn btn-primary">{editingId ? "Save" : "Add"}</button></div>
        {editingId && <div className="col-12"><button type="button" className="btn btn-link" onClick={() => { setEditingId(null); setForm(blank); }}>Cancel edit</button></div>}
      </form>
    </div></div>
    <div className="card page-card"><div className="card-body table-responsive"><table className="table">
      <thead><tr><th>ID</th><th>Name</th><th>Email</th><th>Actions</th></tr></thead>
      <tbody>{staff.map(s => <tr key={s.id}><td>{s.id}</td><td>{s.name}</td><td>{s.email}</td><td>
        <button className="btn btn-sm btn-warning me-2" onClick={() => { setEditingId(s.id); setForm({ name: s.name, email: s.email, password: "" }); }}>Edit</button>
        <button className="btn btn-sm btn-danger" onClick={() => remove(s.id)}>Delete</button>
      </td></tr>)}
      {staff.length === 0 && <tr><td colSpan="4" className="text-center">No staff added.</td></tr>}</tbody>
    </table></div></div>
  </div>;
}
