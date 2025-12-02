const express = require("express");
const router = express.Router();

const {
  authenticateToken,
  isAdmin
} = require("../middleware/permissionMiddleware");

const reportController = require("../controllers/reportController");

router.get("/daily", authenticateToken, isAdmin, reportController.getDailyReports);

module.exports = router;
