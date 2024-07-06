const { v4: uuidv4 } = require('uuid');
const moment = require('moment');
const createSpeechRequest = require('../services/unrealspeech_service');

const { Kandidat, Pemilih, Pilihan } = require('../models');
const { Socket, formatDateTime } = require('../utils')
const { AES } = require('../utils');
const { SHA } = require('../utils');
const { data } = require('jquery');

const vote = async (req, res) => {
  const { kandidat } = req.body;

  try {
    const user = req.session.user
    const idPemilih = await Pemilih.findOne({ where: { user_id: user.id } })

    const pemilih = await Pilihan.findOne({
      where: {
        pemilih_id: idPemilih.id
      }
    })

    if (pemilih != null) {
      return res.status(409).json({
        success: false,
        message: 'Anda hanya dapat memilih satu kali'
      });
    }

    const kandidatExists = await Kandidat.findByPk(kandidat);

    if (!kandidatExists) {
      return res.status(404).json({
        success: false,
        message: 'Kandidat tidak ditemukan'
      });
    }

    // Get previous block
    const lastData = await Pilihan.findAll({
      order: [['created_at', 'DESC']],
      limit: 2
    });

    if (!lastData) {
      return res.status(503).json({
        success: false,
        message: 'Service belum siap'
      });
    }

    const lastBlockData = lastData.map(data => {
      const plainData = data.get({ plain: true });
      plainData.created_at = formatDateTime(plainData.created_at);
      return plainData;
    });

    // Verify Last Block
    if (lastData.length > 1) {
      const lastTwoBlock = lastBlockData[1]
      const lastBlock = lastBlockData[0]

      const verifyBlock = SHA.verifyHash(lastTwoBlock, lastBlock.previous_hash)

      if (!verifyBlock) {
        return res.status(403).json({
          success: false,
          message: 'Terjadi dugaan peretasan'
        });
      }
    }

    const encryptData = AES.encrypt({ kandidat_id: kandidatExists.id });
    const hashedLastBlock = SHA.generateHash(lastBlockData[0]);

    const newBlock = {
      pemilih_id: idPemilih.id,
      data: encryptData,
      hash: SHA.generateHash(uuidv4()),
      previous_hash: hashedLastBlock,
      created_at: new Date(),
    };

    const newHashedBlock = SHA.generateHash(newBlock)
    newBlock.hash = newHashedBlock

    await Pilihan.create(newBlock)
    const io = Socket.getIo();
    const now = moment(new Date()).format('HH:mm');
    createSpeechRequest(`${idPemilih.name} have voted at ${now} WI`)
      .then(response => {
        io.emit('message', {
          message: `${idPemilih.name} has voted at ${now}`,
          name: idPemilih.name,
          created_at: moment(new Date()).format('HH:mm:ss DD-MM-YYYY'),
          audio: response.OutputUri
        });
      })
      .catch(err => {
        console.error('Error:', err);
      });

    res.status(201).json({ success: true, message: 'Vote berhasil' });
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Terjadi kesalahan pada server' });
  }
};

module.exports = {
  vote
};
