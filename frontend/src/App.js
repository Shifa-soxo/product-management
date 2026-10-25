import React, { useState } from "react";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Products from "./pages/Products";
import Staff from "./pages/Staff";
import Customers from "./pages/Customers";
import Orders from "./pages/Orders";
import Reports from "./pages/Reports";

function App() {
  const [auth, setAuth] = useState(() => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "null");
      const token = localStorage.getItem("token");
      return user && token ? { user, token } : null;
    } catch { return null; }
  });
  const [page, setPage] = useState("products");
  const [showRegister, setShowRegister] = useState(false);

  function login(data) {
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    setAuth({ token: data.token, user: data.user });
    setPage("products");
  }
  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setAuth(null);
    setPage("products");
  }

  if (!auth) {
    return showRegister
      ? <Register onRegistered={() => setShowRegister(false)} onBack={() => setShowRegister(false)} />
      : <Login onLogin={login} onShowRegister={() => setShowRegister(true)} />;
  }

  const role = auth.user.role;
  const navItems = [
    { key: "products", label: "Products", roles: ["admin", "staff", "customer"] },
    { key: "staff", label: "Manage Staff", roles: ["admin"] },
    { key: "customers", label: "Customers", roles: ["admin", "staff"] },
    { key: "orders", label: role === "customer" ? "My Orders" : "Manage Orders", roles: ["admin", "staff", "customer"] },
    { key: "reports", label: "Reports", roles: ["admin"] }
  ].filter(item => item.roles.includes(role));

  return <>
    <Navbar user={auth.user} onLogout={logout} onNavigate={setPage} />
    <div className="container-fluid bg-white border-bottom py-2">
      <div className="container d-flex flex-wrap gap-2">
        {navItems.map(item => <button key={item.key} className={`btn btn-sm ${page === item.key ? "btn-primary" : "btn-outline-primary"}`} onClick={() => setPage(item.key)}>{item.label}</button>)}
      </div>
    </div>
    {page === "products" && <Products user={auth.user} />}
    {page === "staff" && role === "admin" && <Staff />}
    {page === "customers" && ["admin", "staff"].includes(role) && <Customers />}
    {page === "orders" && <Orders user={auth.user} />}
    {page === "reports" && role === "admin" && <Reports />}
  </>;
}

export default App;
