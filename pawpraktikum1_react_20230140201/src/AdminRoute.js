import { jwtDecode } from "jwt-decode";
import React from "react";
import { Navigate } from "react-router-dom";

function AdminRoute({ children }) {
  const token = localStorage.getItem("token");

  if (!token) return <Navigate to="/login" />;

  const user = jwtDecode(token);

  return user.role === "admin" ? children : <Navigate to="/dashboard" />;
}

export default AdminRoute;
