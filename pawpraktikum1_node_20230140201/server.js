const express = require("express");
const app = express();
const PORT = 5000;

// Endpoint GET utama
app.get("/", (req, res) => {
  res.json({ message: "Hello from Server!" });
});

// Jalankan server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
