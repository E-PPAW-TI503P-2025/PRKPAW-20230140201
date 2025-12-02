const express = require("express");
const router = express.Router();

const { authenticateToken } = require("../middleware/permissionMiddleware");
const presensiController = require("../controllers/presensiController");

// WAJIB pasang authenticateToken di sini:
router.post("/check-in", authenticateToken, presensiController.checkIn);
router.post("/check-out", authenticateToken, presensiController.checkOut);

module.exports = router;
