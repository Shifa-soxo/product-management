import React, { useEffect, useState } from "react";
import api from "../api";
import Message from "../components/Message";

export default function Orders({ user }) {
  const [orders, setOrders] = useState([]);
  const [message, setMessage] = useState("");
  const [type, setType] = useState("success");
  const isCustomer = user.role === "customer";

  async function load() {
    try {
      const response = await api.get(isCustomer ? "/orders/my-orders" : "/orders");
      setOrders(response.data);
    } catch (error) {
      setMessage(error.response?.data?.message || "Could not load orders."); setType("danger");
    }
  }
  useEffect(() => { load(); }, [user.role]);

  async function changeStatus(id, status) {
    try { await api.put(`/orders/${id}/status`, { status }); setMessage("Order status updated."); setType("success"); load(); }
    catch (error) { setMessage(error.response?.data?.message || "Could not update order."); setType("danger"); }
  }
  async function cancel(id) {
    if (!window.confirm("Cancel this pending order?")) return;
    try { await api.put(`/orders/my-orders/${id}/cancel`); setMessage("Order cancelled."); setType("success"); load(); }
    catch (error) { setMessage(error.response?.data?.message || "Could not cancel order."); setType("danger"); }
  }

  return <div className="container py-4">
    <h2>{isCustomer ? "My Orders" : "Manage Orders"}</h2><Message message={message} type={type} />
    <div className="card page-card"><div className="card-body table-responsive"><table className="table table-striped">
      <thead><tr><th>Order</th>{!isCustomer && <th>Customer</th>}<th>Product</th><th>Qty</th><th>Total</th><th>Status</th><th>Action</th></tr></thead>
      <tbody>{orders.map(o => <tr key={o.id}>
        <td>#{o.id}</td>{!isCustomer && <td>{o.User?.name || "Customer"}<br/><small>{o.User?.email}</small></td>}
        <td>{o.Product?.name || `Product #${o.productId}`}</td><td>{o.quantity}</td><td>₹{Number(o.totalAmount).toFixed(2)}</td><td>{o.status}</td>
        <td>{isCustomer ? (o.status === "Pending" ? <button className="btn btn-sm btn-outline-danger" onClick={() => cancel(o.id)}>Cancel</button> : "—") :
          (o.status === "Pending" ? <select className="form-select form-select-sm" value={o.status} onChange={e => changeStatus(o.id, e.target.value)}><option>Pending</option><option>Confirmed</option><option>Delivered</option><option>Cancelled</option></select> :
          o.status === "Confirmed" ? <select className="form-select form-select-sm" value={o.status} onChange={e => changeStatus(o.id, e.target.value)}><option>Confirmed</option><option>Delivered</option><option>Cancelled</option></select> : "—")}
        </td>
      </tr>)}
      {orders.length === 0 && <tr><td colSpan={isCustomer ? 6 : 7} className="text-center">No orders found.</td></tr>}</tbody>
    </table></div></div>
  </div>;
}
