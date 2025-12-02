import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "./Navbar";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from 'leaflet'; // 💡 Tambahkan impor Leaflet untuk ikon
import "./PresensiPage.css";

// 💡 Definisikan ikon marker default agar Leaflet dapat menampilkannya
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});


function PresensiPage() {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [coords, setCoords] = useState(null);
  const [loading, setLoading] = useState(false);
  // 💡 Tambahkan base URL untuk Axios agar kode lebih bersih
  const BASE_URL = "http://localhost:3001/api/presensi"; 

  // Fungsi untuk mendapatkan lokasi pengguna
  const getLocation = () => {
    setLoading(true);
    // Cek ketersediaan Geolocation API
    if (!navigator.geolocation) {
      setError("Geolocation tidak didukung oleh browser ini.");
      setLoading(false);
      return;
    }
    
    navigator.geolocation.getCurrentPosition(
        (position) => {
          setCoords({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          setLoading(false);
        },
        (err) => { // Gunakan 'err' untuk membedakan dari state 'error'
          console.error("Geolocation error:", err);
          // Kasus umum: Izin ditolak (code: 1)
          if (err.code === 1) {
            setError("Akses lokasi ditolak. Presensi memerlukan izin lokasi.");
          } else {
            setError("Gagal mendapatkan lokasi: " + err.message);
          }
          setLoading(false);
        }
    );
  };

  // Dapatkan lokasi saat komponen dimuat
  useEffect(() => {
    getLocation();
  }, []);

  // Auto-clear messages setelah 3 detik
  useEffect(() => {
    if (message || error) {
      const timer = setTimeout(() => {
        setMessage("");
        setError("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [message, error]);

  const handleCheckIn = async () => {
    setError("");
    setMessage("");

    if (!coords) {
      setError("Lokasi belum didapatkan. Mohon tunggu atau izinkan akses lokasi.");
      return;
    }
    
    setLoading(true); // Mulai loading saat request

    try {
      const token = localStorage.getItem("token");
      console.log("Check-in coordinates:", coords);

      const res = await axios.post(
        `${BASE_URL}/check-in`, // Menggunakan BASE_URL
        {
          // Pastikan koordinat dikirim sebagai string agar sesuai dengan DECIMAL(10,8) di Sequelize
          latitude: coords.lat.toString(), 
          longitude: coords.lng.toString(),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Check-in response:", res.data);
      setMessage(res.data.message);
    } catch (err) {
      console.error("Check-in error:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Check-in gagal!");
    } finally {
        setLoading(false); // Selesaikan loading
    }
  };

  const handleCheckOut = async () => {
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      const res = await axios.post(
        `${BASE_URL}/check-out`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Check-out response:", res.data);
      setMessage(res.data.message);
    } catch (err) {
      console.error("Check-out error:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Check-out gagal!");
    } finally {
        setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <div className="presensi-container">
        {loading && <div className="msg info">Mengambil lokasi...</div>}
        {/* Tampilkan pesan loading di sini */}

        {/* Card */}
        <div className="presensi-card">
          <h1 className="presensi-title">Presensi Kehadiran</h1>

          {/* Peta di dalam card */}
          {coords ? (
            <>
              <div className="location-info">
                <p>📍 Lokasi: {coords.lat.toFixed(6)}, {coords.lng.toFixed(6)}</p>
              </div>
              <div className="my-4 border rounded-lg overflow-hidden">
                <MapContainer
                  center={[coords.lat, coords.lng]}
                  zoom={15}
                  style={{ height: "250px", width: "100%" }}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                  />
                  <Marker position={[coords.lat, coords.lng]}>
                    <Popup>
                      Lokasi Presensi Anda
                      <br />
                      Lat: {coords.lat.toFixed(6)}
                      <br />
                      Lng: {coords.lng.toFixed(6)}
                    </Popup>
                  </Marker>
                </MapContainer>
              </div>
            </>
          ) : (
             !loading && <div className="msg error">Lokasi tidak tersedia. Mohon izinkan akses lokasi.</div>
          )}

          {message && <div className="msg success">{message}</div>}
          {error && <div className="msg error">{error}</div>}

          <div className="button-group">
            <button
              className="btn checkin"
              onClick={handleCheckIn}
              disabled={!coords || loading} // Menonaktifkan tombol jika lokasi belum ada atau sedang loading
            >
              {loading ? 'Memproses...' : '✔ Check-In Sekarang'}
            </button>

            <button
              className="btn checkout"
              onClick={handleCheckOut}
              disabled={loading}
            >
              {loading ? 'Memproses...' : '⏱ Check-Out Sekarang'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default PresensiPage;