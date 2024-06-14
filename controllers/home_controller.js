const { Kandidat, Pemilih, Pilihan } = require('../models');

const index = async (req, res) => {
  const user = req.session.user

  const pemilih = await Pemilih.findOne({ where: { user_id: user.id } })
  const sudahMemilih = await Pilihan.findOne({ where: { pemilih_id: pemilih.id } })

  if (sudahMemilih) {
    return res.redirect('terima-kasih');
  }

  const kandidat = await Kandidat.findAll()

  res.render('index', { kandidat: kandidat });
}

module.exports = {
  index
};
