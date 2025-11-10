const express = require("express");
const router = express.Router();
const presensiController = require("../controllers/presensiController");
const { addUserData } = require("../middleware/permissionMiddleware");

// Middleware user dummy
router.use(addUserData);

// Endpoint presensi
router.post("/check-in", presensiController.CheckIn);
router.post("/check-out", presensiController.CheckOut);

router.put("/:id", presensiController.updatePresensi);
router.delete("/:id", presensiController.deletePresensi);


module.exports = router;
