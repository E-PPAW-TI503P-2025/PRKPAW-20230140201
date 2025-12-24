import React, { useState, useRef, useCallback, useEffect } from "react";
import Webcam from "react-webcam";
import axios from "axios";

// Fungsi ambil token
const getToken = () => localStorage.getItem("token");

function PresensiCard() {
  const [coords, setCoords] = useState(null);
  const [image, setImage] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const webcamRef = useRef(null);

  // Ambil lokasi user
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => setError("Gagal mengambil lokasi GPS!")
    );
  }, []);

  // Ambil foto webcam
  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImage(imageSrc);
  }, []);

  // === HANDLE CHECK IN ===
  const handleCheckIn = async () => {
    setError("");
    setMessage("");

    if (!coords) {
      setError("GPS tidak ditemukan!");
      return;
    }
    if (!image) {
      setError("Foto wajib diambil!");
      return;
    }

    try {
      // Konversi base64 → Blob
      const blob = await (await fetch(image)).blob();

      const formData = new FormData();
      formData.append("latitude", coords.lat);
      formData.append("longitude", coords.lng);
      formData.append("image", blob, "selfie.jpg");

      const response = await axios.post(
        "http://localhost:3001/api/presensi/check-in",
        formData,
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setMessage(response.data.message);
    } catch (err) {
      console.error("Check-in error:", err);
      setError(err.response?.data?.message || "Gagal check-in!");
    }
  };

  // === (optional) HANDLE CHECK OUT ===
  const handleCheckOut = async () => {
    setError("");
    setMessage("");

    try {
      const response = await axios.post(
        "http://localhost:3001/api/presensi/check-out",
        {},
        { headers: { Authorization: `Bearer ${getToken()}` } }
      );

      setMessage(response.data.message);
    } catch (err) {
      setError(err.response?.data?.message || "Gagal check-out!");
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      
      {/* Kamera */}
      <div className="my-4 border rounded-lg overflow-hidden bg-black">
        {image ? (
          <img src={image} alt="Selfie" className="w-full" />
        ) : (
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            className="w-full"
          />
        )}
      </div>

      {/* Tombol Ambil Foto */}
      <div className="mb-4">
        {!image ? (
          <button
            onClick={capture}
            className="bg-blue-600 text-white py-2 px-4 rounded w-full"
          >
            Ambil Foto 📸
          </button>
        ) : (
          <button
            onClick={() => setImage(null)}
            className="bg-gray-600 text-white py-2 px-4 rounded w-full"
          >
            Foto Ulang 🔄
          </button>
        )}
      </div>

      {/* Tombol Check-In & Check-Out */}
      <div className="flex space-x-4">
        <button
          onClick={handleCheckIn}
          className="bg-green-600 text-white py-2 px-4 rounded w-full"
        >
          Check In
        </button>

        <button
          onClick={handleCheckOut}
          className="bg-red-600 text-white py-2 px-4 rounded w-full"
        >
          Check Out
        </button>
      </div>

      {/* Pesan */}
      {message && <p className="text-green-600 mt-3">{message}</p>}
      {error && <p className="text-red-600 mt-3">{error}</p>}
    </div>
  );
}

export default PresensiCard;
