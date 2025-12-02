const { Presensi } = require("../models");
const { Op } = require("sequelize"); // Diperlukan untuk query WHERE

exports.checkIn = async (req, res) => {
  try {
    console.log("checkIn request - user:", req.user);
    
    const userId = req.user.id;
    const { latitude, longitude } = req.body;
    
    // PERBAIKAN: Cek apakah user sudah check-in dan belum check-out
    const existingPresensi = await Presensi.findOne({
      where: { userId, checkOut: null }
    });

    if (existingPresensi) {
        return res.status(400).json({ message: "Anda sudah melakukan check-in dan belum check-out!" });
    }

    const newPresensi = await Presensi.create({
      userId,
      checkIn: new Date(),
      checkOut: null,
      // Simpan koordinat yang diterima dari frontend
      latitude: latitude || null,
      longitude: longitude || null,
    });

    console.log("checkIn success:", newPresensi);
    res.status(201).json({ message: "Check-in berhasil", data: newPresensi }); 
  } catch (error) {
    console.error("checkIn error:", error.message);
    res.status(500).json({ message: "Check-in gagal", error: error.message });
  }
};

exports.checkOut = async (req, res) => {
  try {
    console.log("checkOut request - user:", req.user);
    
    const userId = req.user.id;

    const presensi = await Presensi.findOne({
      where: { userId, checkOut: null }
    });

    if (!presensi) {
      return res.status(400).json({ message: "Belum melakukan check-in!" });
    }

    presensi.checkOut = new Date();
    await presensi.save();

    console.log("checkOut success:", presensi);
    res.json({ message: "Check-out berhasil", data: presensi });
  } catch (error) {
    console.error("checkOut error:", error.message);
    res.status(500).json({ message: "Check-out gagal", error: error.message });
  }
};