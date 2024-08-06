const { Kandidat, Pilihan, Pemilih } = require('../models')
const { Op } = require('sequelize')
const moment = require('moment')
const { AES } = require('../utils')
const fs = require('fs').promises
const path = require('path')

const liveReport = async (req, res) => {
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
        limit: 15
    })

    const formattedData = data.map(item => {
        return {
            ...item.get(),
            created_at: moment(item.created_at).format('HH:mm:ss DD-MM-YYYY'),
            Pemilih: item.Pemilih ? item.Pemilih.get() : null
        }
    })

    res.render('live-report', { data: formattedData, layout: false })
}

const suara = async () => {
    try {
        // Ambil data dari database
        const data = await Pilihan.findAll({
            where: {
                data: { [Op.ne]: null } // Memastikan data tidak null
            },
            order: [['created_at', 'ASC']]
        })

        if (data.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Tidak ada data blok yang ditemukan'
            })
        }

        // Membuat objek untuk menyimpan total suara per kandidat
        const voteCounts = {}

        // Mengumpulkan ID kandidat dari data dan menghitung jumlah suara
        for (const item of data) {
            const decryptedData = AES.decrypt(item.data, process.env.SECRET_KEY) // Dekripsi data
            const kandidat = await Kandidat.findOne({ where: { id: decryptedData.kandidat_id } })

            if (kandidat) {
                // Jika kandidat sudah ada dalam voteCounts, tambahkan jumlah suaranya
                if (voteCounts[kandidat.id]) {
                    voteCounts[kandidat.id].votes += 1
                } else {
                    // Jika kandidat belum ada dalam voteCounts, buat entri baru
                    voteCounts[kandidat.id] = {
                        id: kandidat.id,
                        name: kandidat.name,
                        votes: 1 // Menghitung suara untuk kandidat ini
                    }
                }
            }
        }

        // Mengubah objek voteCounts menjadi array
        const result = Object.values(voteCounts)

        await fs.writeFile('./data/temporary_result.json', JSON.stringify(result, null, 2), 'utf8')
    } catch (error) {
        console.error('Error menjalankan fungsi suara:', error)
    }
}

const getTemporaryResult = async (req, res) => {
    try {
        // Tentukan path file JSON
        const filePath = path.join(__dirname, '../data', 'temporary_result.json')

        // Baca file JSON
        const fileContent = await fs.readFile(filePath, 'utf8')
        const result = JSON.parse(fileContent)

        // Periksa apakah data ada
        if (result.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Tidak ada data hasil sementara ditemukan'
            })
        }

        // Kirimkan data sebagai respons
        res.json(result)
    } catch (error) {
        console.error('Error reading file:', error)
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan saat membaca data'
        })
    }
}
module.exports = {
    liveReport,
    suara,
    getTemporaryResult
}
