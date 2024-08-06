const { v4: uuidv4 } = require('uuid')

const { Kandidat, Pemilih, Pilihan } = require('../../models')
const { Socket, formatDateTime } = require('../../utils')
const { AES } = require('../../utils')
const { SHA } = require('../../utils')

const view = async (req, res) => {
  const name = req.session.name
  res.render('admin/testing', { title: 'Testing', name })
}

const addBlock = async (req, res) => {
  const total = req.body.total
  const startTime = Date.now()
  try {
    const idPemilih = await Pemilih.findOne()
    if (!idPemilih) {
      return res.status(404).json({
        success: false,
        message: 'Pemilih tidak ditemukan'
      })
    }
    const countOfKandidat = await Kandidat.count()

    if (countOfKandidat == 0) {
      return res.status(404).json({
        success: false,
        message: 'Kandidat tidak ditemukan'
      })
    }
    
    for (let i = 1; i <= total; i++) {
      // Get previous block
      const kandidatExists = await getRandomKandidat()
   
      const lastData = await Pilihan.findAll({
        order: [['id', 'DESC']],
        limit: 2
      })

      if (lastData.length === 0) {
        return res.status(503).json({
          success: false,
          message: 'Service belum siap'
        })
      }

      const lastBlockData = lastData.map(data => {
        const plainData = data.get({ plain: true })
        plainData.created_at = formatDateTime(plainData.created_at)
        return plainData
      })

      // Verify Last Block
      if (lastData.length > 1) {
        const lastTwoBlock = lastBlockData[1]
        const lastBlock = lastBlockData[0]

        const verifyBlock = SHA.verifyHash(lastTwoBlock, lastBlock.previous_hash)
        if (!verifyBlock) {
          return res.status(403).json({
            success: false,
            message: 'Terjadi dugaan peretasan'
          })
        }
      }

      const encryptData = AES.encrypt({ kandidat_id: kandidatExists.id }, process.env.SECRET_KEY)
      const hashedLastBlock = SHA.generateHash(lastBlockData[0])

      const newBlock = {
        pemilih_id: idPemilih.id,
        data: encryptData,
        hash: SHA.generateHash(uuidv4()),
        previous_hash: hashedLastBlock,
        created_at: new Date(),
      }

      const newHashedBlock = SHA.generateHash(newBlock)
      newBlock.hash = newHashedBlock

      await Pilihan.create(newBlock)
      const endTime = Date.now()
      const time = endTime - startTime
      const io = Socket.getIo()
      io.emit('testing-add-block', {
        iteration: i,
        time: time,
      })
    }

    res.status(201).json({ success: true, message: 'Vote berhasil' })
  } catch (error) {
    res.status(500).json({ error: 'Terjadi kesalahan pada server' })
  }
}


const readBlocks = async (req, res) => {
  const total = req.body.total
  try {
    const startTime = Date.now()
    // Ambil semua blok dari tabel Pilihan
    const blocks = await Pilihan.findAll({
      order: [['created_at', 'ASC']],
      limit: 1 + parseInt(total) // 1 untuk genesis data
    })

    if (blocks.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Tidak ada data blok yang ditemukan'
      })
    }
    let result = []
    let voteCounts = {}
    const io = Socket.getIo()
    let i = 0
    for (const block of blocks) {

      if (block.data != null) {
        const data = AES.decrypt(block.data, process.env.SECRET_KEY)
        const kandidatId = data.kandidat_id
        const kandidat = await Kandidat.findOne({ where: { id: kandidatId } })

        if (voteCounts[kandidatId]) {

          voteCounts[kandidatId].votes += 1
        } else {
          voteCounts[kandidatId] = {
            kandidat_id: kandidatId,
            kandidat_name: kandidat.name,
            votes: 1
          }
        }

        const endTime = Date.now()
        const time = endTime - startTime
        io.emit('testing-read-block', {
          iteration: i,
          time: time,
        })
      }
      i++
    };


    // Mengubah objek voteCounts menjadi array
    result = Object.values(voteCounts)
    res.status(200).json({
      success: true,
      data: result
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan pada server'
    })
  }
}

const getRandomKandidat = async () => {
  const { count } = await Kandidat.findAndCountAll()
  const randomIndex = Math.floor(Math.random() * count)

  const kandidat = await Kandidat.findOne({
    offset: randomIndex,
  })

  return kandidat
}
module.exports = {
  view,
  addBlock,
  readBlocks
}
