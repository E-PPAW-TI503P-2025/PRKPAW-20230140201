import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await axios.post("http://localhost:3001/api/auth/login", {
        email,
        password,
      });

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user || { email }));
      navigate("/dashboard");
    } catch (err) {
      console.error("Login error:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Email atau password salah");
    }
  };

  return (
    <div className="center-screen">
      <div className="card">
        <h1>Login</h1>

        <form onSubmit={handleSubmit}>
          <label>Email</label>
          <input
            className="input"
            type="email"
            placeholder="Masukkan email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label>Password</label>
          <input
            className="input"
            type="password"
            placeholder="Masukkan password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button className="button">Login</button>
        </form>

        {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}

        <span onClick={() => navigate("/register")} className="link">
          Belum punya akun? Register
        </span>
      </div>
    </div>
  );
}

export default LoginPage;
