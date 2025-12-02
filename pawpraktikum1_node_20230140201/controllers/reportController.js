// controllers/reportController.js
const { Presensi, User } = require("../models");
const { Op } = require("sequelize");

exports.getDailyReports = async (req, res) => {
  try {
    // Ambil parameter dari query URL
    const { nama, awal, akhir } = req.query; 

    const userWhere = {};
    if (nama) {
        userWhere.nama = {
            [Op.like]: `%${nama}%`,
        };
    }

    const presensiWhere = {};
    
    if (awal && akhir) {
        const dateAkhir = new Date(akhir);
        dateAkhir.setDate(dateAkhir.getDate() + 1); // Tambah 1 hari untuk mencakup akhir hari
        presensiWhere.checkIn = {
            [Op.between]: [
                new Date(awal), 
                dateAkhir
            ],
        };
    } else if (awal) {
        presensiWhere.checkIn = { [Op.gte]: new Date(awal) };
    } else if (akhir) {
        const dateAkhir = new Date(akhir);
        dateAkhir.setDate(dateAkhir.getDate() + 1);
        presensiWhere.checkIn = { [Op.lt]: dateAkhir };
    }
    
    const queryOptions = {
      where: presensiWhere, // Klausa WHERE untuk Presensi
      include: [
        {
          model: User,
          attributes: ["nama"],
          as: 'user', // Alias harus sama dengan di Presensi.js
          where: userWhere, // Klausa WHERE untuk User
        }
      ],
      order: [["checkIn", "DESC"]],
    };
    
    // Hapus properti where jika kosong
    if (Object.keys(queryOptions.where).length === 0) { delete queryOptions.where; }
    if (Object.keys(queryOptions.include[0].where).length === 0) { delete queryOptions.include[0].where; }


    const result = await Presensi.findAll(queryOptions);

    res.json(result);
  } catch (err) {
    res.status(500).json({
      message: "Gagal mengambil laporan presensi",
      error: err.message,
    });
  }
};