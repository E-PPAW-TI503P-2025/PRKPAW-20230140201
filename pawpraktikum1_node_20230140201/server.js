const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const app = express();
const PORT = 3001;

// ✅ Middleware dasar (JANGAN pakai bodyParser)
app.use(cors());
app.use(express.json()); // parser utama untuk JSON
app.use(express.urlencoded({ extended: true })); // untuk antisipasi form data
app.use(morgan("dev"));

// ✅ Logging tambahan untuk debug body
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  console.log("Body diterima:", req.body); // Tambahan penting untuk cek apakah body terbaca
  next();
});

// ✅ Route utama
app.get("/", (req, res) => {
  res.status(200).json({
    message: "Selamat datang di API Server Presensi!",
    availableEndpoints: ["/api/presensi", "/api/reports"],
  });
});

// ✅ Import routes
const presensiRoutes = require("./routes/presensi");
const reportRoutes = require("./routes/report");

const authRoutes = require('./routes/auth');

// ✅ Gunakan routes
app.use("/api/presensi", presensiRoutes);
app.use("/api/reports", reportRoutes);
app.use('/api/auth', authRoutes);

// ✅ 404 Handler
app.use((req, res) => {
  res.status(404).json({ message: "Endpoint tidak ditemukan" });
});

// ✅ Global Error Handler
app.use((err, req, res, next) => {
  console.error("Terjadi error:", err.stack);
  res.status(500).json({ message: "Terjadi kesalahan pada server" });
});

// ✅ Jalankan server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}/`);
});
