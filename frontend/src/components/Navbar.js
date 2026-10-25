import React from "react";

export default function Navbar({ user, onLogout, onNavigate }) {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary px-3">
      <button className="navbar-brand btn btn-link text-white text-decoration-none" onClick={() => onNavigate("home")}>
        Product Management
      </button>
      <div className="ms-auto d-flex align-items-center gap-2 flex-wrap">
        {user && <span className="text-white small">{user.name} ({user.role})</span>}
        {user && <button className="btn btn-sm btn-light" onClick={onLogout}>Logout</button>}
      </div>
    </nav>
  );
}
