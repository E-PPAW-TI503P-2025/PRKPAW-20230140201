const { Presensi } = require("../models");

exports.updatePresensi = async (req, res) => {
  try {
    const presensiId = req.params.id;
    const { checkIn, checkOut, nama } = req.body;

    console.log("Body diterima di updatePresensi:", req.body);

    if (checkIn === undefined && checkOut === undefined && nama === undefined) {
      return res.status(400).json({
        message: "Request body tidak berisi data yang valid untuk diupdate (checkIn, checkOut, atau nama).",
      });
    }

    const recordToUpdate = await Presensi.findByPk(presensiId);
    if (!recordToUpdate) {
      return res.status(404).json({ message: "Catatan presensi tidak ditemukan." });
    }

    // ✅ Update hanya field yang dikirim
    if (nama !== undefined) recordToUpdate.nama = nama;
    if (checkIn !== undefined) recordToUpdate.checkIn = checkIn;
    if (checkOut !== undefined) recordToUpdate.checkOut = checkOut;

    await recordToUpdate.save();

    res.json({
      message: "Data presensi berhasil diperbarui.",
      data: recordToUpdate,
    });
  } catch (error) {
    res.status(500).json({
      message: "Terjadi kesalahan pada server",
      error: error.message,
    });
  }
};
