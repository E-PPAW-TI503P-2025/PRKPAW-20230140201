import React from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  let user = null;
  if (token) {
    try {
      user = jwtDecode(token);
    } catch (err) {}
  }

  return (
    <nav className="w-full px-8 py-4 bg-green-700 text-white shadow-md flex justify-between items-center">
      <h1
        className="text-xl font-bold cursor-pointer tracking-wide"
        onClick={() => navigate("/dashboard")}
      >
        Sistem Presensi
      </h1>

      <div className="flex items-center gap-6">
        {user && (
          <span className="text-green-200 font-medium">
            Halo, {user.nama}
          </span>
        )}

        <button
          onClick={() => navigate("/presensi")}
          className="hover:text-green-300"
        >
          Presensi
        </button>

        {user?.role === "admin" && (
          <button
            onClick={() => navigate("/reports")}
            className="hover:text-green-300"
          >
            Laporan Admin
          </button>
        )}

        <button
          onClick={() => {
            localStorage.removeItem("token");
            navigate("/login");
          }}
          className="bg-red-500 px-4 py-2 rounded-lg hover:bg-red-600 shadow"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
