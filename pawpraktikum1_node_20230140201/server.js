require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const path = require('path'); 

const iotRoutes = require("./routes/iot");
// CORS Configuration
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ROUTES
app.use("/api/auth", require("./routes/auth"));
app.use("/api/presensi", require("./routes/presensi"));
app.use("/api/report", require("./routes/report"));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use("/api/iot", iotRoutes);

app.listen(3001, () => {
  console.log("Server running at http://localhost:3001/");
});
