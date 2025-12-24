// ==========================
// MULTER UPLOAD (DIGABUNG)
// ==========================
const multer = require('multer');
const path = require('path');
const { Presensi } = require("../models");

// Konfigurasi penyimpanan gambar
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); 
  },
  filename: (req, file, cb) => {
    cb(null, `${req.user.id}-${Date.now()}${path.extname(file.originalname)}`);
  }
});

// Validasi jenis file
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Hanya file gambar yang diperbolehkan!'), false);
  }
};

// Export multer upload
exports.upload = multer({ storage, fileFilter });



// ==========================
// FUNGSI CHECK-IN
// ==========================
exports.checkIn = async (req, res) => {
  try {
    const userId = req.user.id;
    const { latitude, longitude } = req.body;

    // Ambil foto dari multer
    const buktiFoto = req.file ? req.file.path : null;

    // Cek apakah user sudah check-in dan belum check-out
    const existing = await Presensi.findOne({
      where: { userId, checkOut: null }
    });

    if (existing) {
      return res.status(400).json({
        message: "Anda sudah melakukan check-in dan belum check-out!"
      });
    }

    // Buat record presensi baru
    const newRecord = await Presensi.create({
      userId,
      checkIn: new Date(),
      checkOut: null,
      latitude: latitude || null,
      longitude: longitude || null,
      buktiFoto // Simpan foto check-in
    });

    res.status(201).json({
      message: "Check-in berhasil",
      data: newRecord
    });

  } catch (error) {
    console.error("Check-in error:", error);
    res.status(500).json({
      message: "Check-in gagal",
      error: error.message
    });
  }
};



// ==========================
// FUNGSI CHECK-OUT
// ==========================
exports.checkOut = async (req, res) => {
  try {
    const userId = req.user.id;

    // Ambil foto checkout
    const buktiFotoCheckout = req.file ? req.file.path : null;

    // Cari presensi yang belum check-out
    const presensi = await Presensi.findOne({
      where: { userId, checkOut: null }
    });

    if (!presensi) {
      return res.status(400).json({
        message: "Anda belum melakukan check-in!"
      });
    }

    presensi.checkOut = new Date();
    presensi.buktiFotoCheckout = buktiFotoCheckout;

    await presensi.save();

    res.json({
      message: "Check-out berhasil",
      data: presensi
    });

  } catch (error) {
    console.error("Check-out error:", error);
    res.status(500).json({
      message: "Check-out gagal",
      error: error.message
    });
  }
};
