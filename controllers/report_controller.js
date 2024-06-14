const { Pilihan, Pemilih } = require('../models');
const { Op } = require('sequelize');
const moment = require('moment');

const liveReport = async (req, res) => {
    const data = await Pilihan.findAll({
        where: {
            pemilih_id: {
                [Op.ne]: null
            }
        },
        include: [{
            model: Pemilih,
            as: 'Pemilih'
        }]
    });

    const formattedData = data.map(item => {
        return {
            ...item.get(),
            created_at: moment(item.created_at).format('HH:mm:ss DD-MM-YYYY'),
            Pemilih: item.Pemilih ? item.Pemilih.get() : null
        };
    });

    res.render('live-report', { data: formattedData, layout: false });
}

module.exports = {
    liveReport

};
