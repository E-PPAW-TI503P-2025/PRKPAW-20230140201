import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function RegisterPage() {
  const [nama, setNama] = useState("");
  const [role, setRole] = useState("mahasiswa");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post("http://localhost:3001/api/auth/register", {
        nama,
        role,
        email,
        password,
      });

      alert("Berhasil daftar!");
      navigate("/login");
    } catch (error) {
      console.error("Register error:", error.response?.data || error.message);
      setError(error.response?.data?.message || "Registrasi gagal");
    }
  };

  return (
    <div className="center-screen">
      <div className="card">
        <h2>Register Akun</h2>

        <form onSubmit={handleSubmit}>
          <label>Nama</label>
          <input
            className="input"
            type="text"
            placeholder="Nama lengkap"
            value={nama}
            onChange={(e) => setNama(e.target.value)}
          />

          <label>Role</label>
          <select className="input" value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="mahasiswa">Mahasiswa</option>
            <option value="admin">Admin</option>
          </select>

          <label>Email</label>
          <input
            className="input"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label>Password</label>
          <input
            className="input"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button className="button">Register</button>
        </form>

        {error && <p style={{ color: "red" }}>{error}</p>}

        <span className="link" onClick={() => navigate("/login")}>
          Sudah punya akun? Login
        </span>
      </div>
    </div>
  );
}

export default RegisterPage;
