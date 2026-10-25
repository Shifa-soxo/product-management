import React, { useEffect, useState } from "react";
import api from "../api";

export default function Reports() {
  const [report, setReport] = useState(null);
  const [error, setError] = useState("");
  useEffect(() => {
    api.get("/orders/reports/summary")
      .then(response => setReport(response.data))
      .catch(err => setError(err.response?.data?.message || "Could not load reports."));
  }, []);

  if (error) return <div className="container py-4"><div className="alert alert-danger">{error}</div></div>;
  if (!report) return <div className="container py-4">Loading reports...</div>;

  const cards = [
    ["Total Products", report.totalProducts],
    ["Total Staff", report.totalStaff],
    ["Total Customers", report.totalCustomers],
    ["Total Orders", report.totalOrders],
    ["Pending Orders", report.pendingOrders],
    ["Delivered Sales", `₹${Number(report.totalSales).toFixed(2)}`]
  ];

  return <div className="container py-4"><h2 className="mb-4">Reports Dashboard</h2><div className="row g-3">
    {cards.map(([label, value]) => <div className="col-sm-6 col-lg-4" key={label}><div className="card page-card"><div className="card-body">
      <div className="text-muted">{label}</div><div className="stat-number">{value}</div>
    </div></div></div>)}
  </div><p className="text-muted small mt-3">Delivered Sales includes orders marked Delivered only.</p></div>;
}
