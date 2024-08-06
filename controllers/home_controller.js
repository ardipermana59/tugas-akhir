const { Kandidat, Pemilih, Pilihan } = require('../models')

const index = async (req, res) => {
  const user = req.session.user
 
  if(user.role == 'admin') {
    return res.redirect('/dashboard')
  }

  const pemilih = await Pemilih.findOne({ where: { user_id: user.id } })
  const sudahMemilih = await Pilihan.findOne({ where: { pemilih_id: pemilih.id } })

  if (sudahMemilih) {
    return res.redirect('terima-kasih')
  }

  const kandidat = await Kandidat.findAll()

  res.render('index', { kandidat: kandidat, layout: false })
}

module.exports = {
  index
}
