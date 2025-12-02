const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "INI_ADALAH_KUNCI_RAHASIA_ANDA_YANG_SANGAT_AMAN";

exports.authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Token tidak disediakan" });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Token tidak valid" });
    }

    req.user = decoded;
    next();
  });
};

exports.isAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ message: "Hanya admin yang dapat mengakses" });
  }
  next();
};
