const { Kandidat, Pemilih, Pilihan } = require('../../models');
const {Op} = require('sequelize');
const moment = require('moment');
const view = async (req, res) => {
  try {
    const jumlahKandidat = await Kandidat.count();
    const jumlahPemilih = await Pemilih.count();

    const data = await Pilihan.findAll({
      order: [['created_at', 'DESC']],
      where: {
        pemilih_id: {
          [Op.ne]: null
        }
      },
      include: [{
        model: Pemilih,
        as: 'Pemilih'
      }],
      limit: 11
    });

    const formattedData = data.map(item => {
      return {
        ...item.get(),
        created_at: moment(item.created_at).format('HH:mm:ss DD-MM-YYYY'),
        Pemilih: item.Pemilih ? item.Pemilih.get() : null
      };
    });


    res.render('admin/dashboard', {
      title: 'Dashboard',
      jumlah_kandidat: jumlahKandidat,
      jumlah_pemilih: jumlahPemilih,
      data: formattedData
    });
  } catch (error) {
    console.log(error)
    res.status(500).send('Internal Server Error');
  }
};

module.exports = {
  view
};
