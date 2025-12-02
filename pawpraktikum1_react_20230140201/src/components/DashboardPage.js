import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

function DashboardPage() {
  const navigate = useNavigate();

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gradient-to-br from-green-200 to-white flex items-center justify-center p-6">
        <div className="bg-white/70 backdrop-blur-md p-10 rounded-3xl shadow-2xl max-w-xl w-full border border-green-300">
          
          <h1 className="text-4xl font-extrabold text-green-700 mb-4 text-center drop-shadow-md">
            Dashboard Presensi
          </h1>

          <p className="text-gray-700 text-lg mb-10 text-center">
            Selamat datang! Silakan melakukan presensi hari ini.
          </p>

          <div className="flex flex-col gap-4">
            <button
              onClick={() => navigate("/presensi")}
              className="w-full py-3 bg-green-600 text-white text-lg font-semibold rounded-xl shadow-md hover:bg-green-700 hover:scale-[1.02] transition-all"
            >
              ➤ Menu Presensi
            </button>

            <button
              onClick={() => {
                localStorage.removeItem("token");
                navigate("/login");
              }}
              className="w-full py-3 bg-red-600 text-white text-lg font-semibold rounded-xl shadow-md hover:bg-red-700 hover:scale-[1.02] transition-all"
            >
              ⎋ Logout
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default DashboardPage;
