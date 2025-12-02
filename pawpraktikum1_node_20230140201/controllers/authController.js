const { User } = require("../models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Semua pakai SECRET dari .env
const JWT_SECRET = process.env.JWT_SECRET || "INI_ADALAH_KUNCI_RAHASIA_ANDA_YANG_SANGAT_AMAN";

exports.register = async (req, res) => {
  try {
    const { nama, email, password, role } = req.body;

    console.log("Register request:", { nama, email, role });

    if (!nama || !email || !password) {
      return res.status(400).json({ message: "Nama, email, dan password harus diisi" });
    }

    if (role && !["mahasiswa", "admin"].includes(role)) {
      return res.status(400).json({ message: "Role tidak valid." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      nama,
      email,
      password: hashedPassword,
      role: role || "mahasiswa",
    });

    res.status(201).json({
      message: "Registrasi berhasil",
      data: { id: newUser.id, email: newUser.email, role: newUser.role },
    });
  } catch (error) {
    console.error("Register error:", error.message);
    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(400).json({ message: "Email sudah terdaftar." });
    }

    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log("Login request:", { email });

    const user = await User.findOne({ where: { email } });
    if (!user) {
      console.log("User not found:", email);
      return res.status(404).json({ message: "Email tidak ditemukan." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("Password mismatch for:", email);
      return res.status(401).json({ message: "Password salah." });
    }

    const payload = {
      id: user.id,
      nama: user.nama,
      role: user.role,
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });

    res.json({
      message: "Login berhasil",
      token: token,
      user: payload,
    });
  } catch (error) {
    console.error("Login error:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
