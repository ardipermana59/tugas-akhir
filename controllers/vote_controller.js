const { v4: uuidv4 } = require('uuid');
const moment = require('moment');
const createSpeechRequest = require('../services/unrealspeech_service');

const { Kandidat, Pemilih, Pilihan } = require('../models');
const socket = require('../utils/SocketIo')
const AES = require('../utils/AES');
const SHA = require('../utils/SHA');

const vote = async (req, res) => {
  const { kandidat } = req.body;

  try {
    const user = req.session.user
    const idPemilih = await Pemilih.findOne({ where: { user_id: user.id } })
    const key = process.SECRET_KEY

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
    const previousData = await Pilihan.findOne({
      order: [['created_at', 'DESC']]
    });

    const data = {
      kandidat_id: kandidatExists.id,
    }

    const encryptData = AES.encrypt(JSON.stringify(data), key)

    const newBlock = {
      id: uuidv4(),
      pemilih_id: idPemilih.id,
      data: encryptData,
      previous_hash: previousData.hash,
      created_at: new Date(),
    };

    const hashedBlock = SHA.generateHash(newBlock)
    newBlock.hash = hashedBlock

    await Pilihan.create(newBlock)
    const io = socket.getIo();
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
    res.status(500).json({ error: 'Terjadi kesalahan pada server' });
  }
};

module.exports = {
  vote
};
