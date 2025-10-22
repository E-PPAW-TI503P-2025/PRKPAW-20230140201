import React, { useState } from "react";

function App() {
  const [nama, setNama] = useState("");
  const [pesan, setPesan] = useState("");

  const handleChange = (event) => {
    setNama(event.target.value);
    setPesan(`Hello, ${event.target.value}!`);
  };

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h2>Masukkan Nama Anda:</h2>
      <input
        type="text"
        placeholder="Ketik nama..."
        value={nama}
        onChange={handleChange}
        style={{
          padding: "10px",
          borderRadius: "8px",
          border: "1px solid #ccc",
        }}
      />
      <h1 style={{ marginTop: "20px", color: "#0078ff" }}>
        {pesan || "Hello!"}
      </h1>
    </div>
  );
}

export default App;
