import React from "react";

export default function Message({ message, type = "info" }) {
  if (!message) return null;
  return <div className={`alert alert-${type} py-2`} role="alert">{message}</div>;
}
