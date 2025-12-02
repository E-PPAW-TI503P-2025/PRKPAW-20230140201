require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();

// Middleware global
app.use(cors());
app.use(express.json());

// ================================
// IMPORT ROUTES
// ================================
const authRoutes = require("./routes/auth");
const presensiRoutes = require("./routes/presensi");
const reportRoutes = require("./routes/report");

// ================================
// REGISTER ROUTES
// ================================
app.use("/api/auth", authRoutes);         // register & login
app.use("/api/presensi", presensiRoutes); // check-in & check-out
app.use("/api/reports", reportRoutes);    // laporan admin

// ================================
// ROOT ENDPOINT
// ================================
app.get("/", (req, res) => {
  res.send("API Presensi Aktif ✔");
});

// ================================
// START SERVER
// ================================
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Server berjalan di port ${PORT}`);
});
