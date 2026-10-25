import React, { useEffect, useState } from "react";
import api from "../api";
import Message from "../components/Message";

export default function Products({ user }) {
  const blank = { name: "", description: "", price: "", stock: "0" };
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(blank);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");
  const [type, setType] = useState("success");
  const isAdmin = user.role === "admin";

  async function load() {
    try { setProducts((await api.get("/products")).data); }
    catch (error) { setMessage(error.response?.data?.message || "Could not load products."); setType("danger"); }
  }
  useEffect(() => { load(); }, []);

  function change(e) { setForm({ ...form, [e.target.name]: e.target.value }); }

  async function save(e) {
    e.preventDefault();
    setMessage("");
    const payload = { ...form, price: Number(form.price), stock: Number(form.stock) };
    try {
      if (editingId) await api.put(`/products/${editingId}`, payload);
      else await api.post("/products", payload);
      setMessage(editingId ? "Product updated." : "Product added.");
      setType("success");
      setForm(blank); setEditingId(null); load();
    } catch (error) {
      setMessage(error.response?.data?.message || "Could not save product.");
      setType("danger");
    }
  }

  function edit(product) {
    setEditingId(product.id);
    setForm({ name: product.name, description: product.description || "", price: product.price, stock: String(product.stock) });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function remove(id) {
    if (!window.confirm("Delete this product?")) return;
    try {
      await api.delete(`/products/${id}`);
      setMessage("Product deleted."); setType("success"); load();
    } catch (error) {
      setMessage(error.response?.data?.message || "Could not delete product.");
      setType("danger");
    }
  }

  async function book(product) {
    const answer = window.prompt(`Quantity to book for ${product.name}:`, "1");
    if (answer === null) return;
    const quantity = Number(answer);
    if (!Number.isInteger(quantity) || quantity < 1) { setMessage("Enter a whole-number quantity."); setType("danger"); return; }
    try {
      const response = await api.post("/orders", { productId: product.id, quantity });
      setMessage(response.data.message); setType("success"); load();
    } catch (error) {
      setMessage(error.response?.data?.message || "Could not book product."); setType("danger");
    }
  }

  return (
    <div className="container py-4">
      <h2 className="mb-3">{isAdmin ? "Manage Products" : "Products"}</h2>
      <Message message={message} type={type} />

      {isAdmin && <div className="card page-card mb-4"><div className="card-body">
        <h5>{editingId ? "Update product" : "Add product"}</h5>
        <form className="row g-3" onSubmit={save}>
          <div className="col-md-3"><label className="form-label">Name</label><input className="form-control" name="name" value={form.name} onChange={change} required /></div>
          <div className="col-md-4"><label className="form-label">Description</label><input className="form-control" name="description" value={form.description} onChange={change} /></div>
          <div className="col-md-2"><label className="form-label">Price</label><input className="form-control" type="number" min="0" step="0.01" name="price" value={form.price} onChange={change} required /></div>
          <div className="col-md-1"><label className="form-label">Stock</label><input className="form-control" type="number" min="0" step="1" name="stock" value={form.stock} onChange={change} required /></div>
          <div className="col-md-2 d-flex align-items-end gap-2">
            <button className="btn btn-primary">{editingId ? "Update" : "Add"}</button>
            {editingId && <button type="button" className="btn btn-secondary" onClick={() => { setEditingId(null); setForm(blank); }}>Cancel</button>}
          </div>
        </form>
      </div></div>}

      <div className="card page-card"><div className="card-body">
        <div className="table-responsive"><table className="table table-striped">
          <thead><tr><th>ID</th><th>Product</th><th>Description</th><th>Price</th><th>Stock</th><th>Action</th></tr></thead>
          <tbody>
            {products.map(p => <tr key={p.id}>
              <td>{p.id}</td><td>{p.name}</td><td>{p.description}</td><td>₹{Number(p.price).toFixed(2)}</td><td>{p.stock}</td>
              <td className="text-nowrap">
                {isAdmin && <><button className="btn btn-sm btn-warning me-1" onClick={() => edit(p)}>Edit</button><button className="btn btn-sm btn-danger me-1" onClick={() => remove(p.id)}>Delete</button></>}
                {user.role === "customer" && <button className="btn btn-sm btn-success" disabled={p.stock < 1} onClick={() => book(p)}>Book</button>}
                {user.role === "staff" && <span className="text-muted">View only</span>}
              </td>
            </tr>)}
            {products.length === 0 && <tr><td colSpan="6" className="text-center">No products yet.</td></tr>}
          </tbody>
        </table></div>
      </div></div>
    </div>
  );
}
