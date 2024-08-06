const { Kandidat, Pilihan } = require('../../models')
const { Socket } = require('../../utils')
const { AES } = require('../../utils')
const { SHA } = require('../../utils')
const { Op } = require('sequelize')

const view = async (req, res) => {
    const data = await Kandidat.findAll()

    const name = req.session.name
    res.render('admin/hasil', { title: 'Hasil', name, data })
}

const generateHasil = async (req, res) => {
    try {
        const blocks = await Pilihan.findAll({
            order: [['created_at', 'ASC']],
            where: {
                data: {
                    [Op.ne]: null
                }
            }
        })

        if (blocks.length === 0) {
            return res.status(204).json({
                success: false,
                message: 'Tidak ada data'
            })
        }
      
        const io = Socket.getIo()
        io.emit('hitung_data', {
            total_data: blocks.length
        })

        const getKandidats = await Kandidat.findAll()
        const results = getKandidats.map(kandidat => ({
            id: kandidat.id,
            vote: 0
        }))
    
        for (const block of blocks) {
            if (block.data != null) {
                const data = AES.decrypt(block.data, process.env.SECRET_KEY)
                const kandidatId = data.kandidat_id

                const kandidatResult = results.find(result => result.id === kandidatId)

                if (kandidatResult) {
                    kandidatResult.vote++
                }

                io.emit('hitung_hasil', {
                    results,
                })
            }
        };

        res.status(200).json({
            success: true,
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan pada server'
        })
    }
    res.render('admin/hasil', { title: 'Hasil' })
}

module.exports = {
    generateHasil,
    view
}
