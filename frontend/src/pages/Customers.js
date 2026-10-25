import React, { useEffect, useState } from "react";
import api from "../api";

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [error, setError] = useState("");
  useEffect(() => {
    api.get("/users/customers")
      .then(response => setCustomers(response.data))
      .catch(err => setError(err.response?.data?.message || "Could not load customers."));
  }, []);
  return <div className="container py-4">
    <h2>Customers</h2>{error && <div className="alert alert-danger">{error}</div>}
    <div className="card page-card"><div className="card-body table-responsive"><table className="table">
      <thead><tr><th>ID</th><th>Name</th><th>Email</th></tr></thead>
      <tbody>{customers.map(c => <tr key={c.id}><td>{c.id}</td><td>{c.name}</td><td>{c.email}</td></tr>)}
      {customers.length === 0 && !error && <tr><td colSpan="3" className="text-center">No customers registered.</td></tr>}</tbody>
    </table></div></div>
  </div>;
}
