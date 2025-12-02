import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import Navbar from "./Navbar";
import { useNavigate } from "react-router-dom";

function ReportPage() {
  const [reports, setReports] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [tanggalAwal, setTanggalAwal] = useState("");
  const [tanggalAkhir, setTanggalAkhir] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false); // Tambahkan state loading

  const navigate = useNavigate();
  const BASE_URL = "http://localhost:3001/api/report/daily"; // Base URL yang lebih bersih

  // Gunakan useCallback untuk memastikan fungsi tidak dibuat ulang pada setiap render
  const fetchReports = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");
    
    setLoading(true);

    try {
      setError(null);

      // Pastikan parameter URL cocok dengan yang diterima di backend (nama, awal, akhir)
      const response = await axios.get(
        `${BASE_URL}?nama=${searchTerm}&awal=${tanggalAwal}&akhir=${tanggalAkhir}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setReports(response.data);
    } catch (err) {
      console.error("Fetch reports error:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Gagal memuat laporan");
    } finally {
        setLoading(false);
    }
  }, [navigate, searchTerm, tanggalAwal, tanggalAkhir]); // Dependency array harus mencakup semua state yang digunakan di dalam fetchReports

  // Panggil fetchReports saat komponen dimuat ATAU ketika tombol "Cari" di-klik
  useEffect(() => {
    // Panggil saat mount, tetapi tidak saat state filter berubah (karena dipicu tombol Cari)
    fetchReports();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Hanya panggil saat mount pertama

  const handleSearch = (e) => {
    e.preventDefault(); // Mencegah form submit default jika menggunakan form
    fetchReports(); // Panggil fetchReports saat tombol Cari ditekan
  };


  const formatLocation = (lat, lng) => {
    if (!lat || !lng) return "Tidak ada lokasi";
    try {
        return `${parseFloat(lat).toFixed(6)}, ${parseFloat(lng).toFixed(6)}`;
    } catch (e) {
        return "Data lokasi invalid";
    }
  };


  return (
    <>
      <Navbar />

      <div className="max-w-6xl mx-auto p-8">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">
          Laporan Presensi Harian
        </h1>

        {/* FORM SEARCH */}
        {/* Gunakan form dan tambahkan onSubmit untuk memicu pencarian */}
        <form onSubmit={handleSearch} className="flex gap-4 mb-6">
          <input
            type="text"
            placeholder="Cari nama..."
            className="px-4 py-2 border rounded"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <input
            type="date"
            className="px-4 py-2 border rounded"
            value={tanggalAwal}
            onChange={(e) => setTanggalAwal(e.target.value)}
          />

          <input
            type="date"
            className="px-4 py-2 border rounded"
            value={tanggalAkhir}
            onChange={(e) => setTanggalAkhir(e.target.value)}
          />

          <button
            type="submit" // Set type="submit" agar onSubmit form bekerja
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
            disabled={loading} // Tambahkan disabled state
          >
            {loading ? 'Memuat...' : 'Cari'}
          </button>
        </form>

        {error && <p className="text-red-600 mb-4">{error}</p>}

        <div className="bg-white shadow rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-bold uppercase">
                  Nama
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold uppercase">
                  Check-In
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold uppercase">
                  Check-Out
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold uppercase">
                  Lokasi (Lat, Lng)
                </th>
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-200">
              {reports.length > 0 ? (
                reports.map((p) => (
                  <tr key={p.id}>
                    <td className="px-6 py-4">{p.user?.nama || "N/A"}</td>
                    <td className="px-6 py-4">
                      {new Date(p.checkIn).toLocaleString("id-ID")}
                    </td>
                    <td className="px-6 py-4">
                      {p.checkOut
                        ? new Date(p.checkOut).toLocaleString("id-ID")
                        : "Belum checkout"}
                    </td>
                    <td className="px-6 py-4">
                      {formatLocation(p.latitude, p.longitude)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="px-6 py-4 text-center" colSpan={4}>
                    {loading ? 'Memuat data...' : 'Tidak ada data'}
                  </td>
                </tr>
              )}
          </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default ReportPage;