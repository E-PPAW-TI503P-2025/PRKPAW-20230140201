const express = require("express");
const router = express.Router();

const { authenticateToken } = require("../middleware/permissionMiddleware");
const presensiController = require("../controllers/presensiController");

// ROUTER CHECK-IN + UPLOAD FOTO
router.post(
  "/check-in",
  [
    authenticateToken,
    presensiController.upload.single("image") // middleware upload
  ],
  presensiController.checkIn // controller check-in
);

// ROUTER CHECK-OUT + UPLOAD FOTO (opsional)
router.post(
  "/check-out",
  [
    authenticateToken,
    presensiController.upload.single("image")
  ],
  presensiController.checkOut
);

module.exports = router;
