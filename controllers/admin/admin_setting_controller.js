const { Pilihan } = require('../../models')
const createGenesisBlock = (req, res) => {

}

const verifyAllBlocks = async (req) => {
    const allBlocks = await Pilihan.findAll({
        order: [['created_at', 'ASC']],
    })

    const formattedBlocks = allBlocks.map(block => {
        const plainBlock = block.get({ plain: true })
        plainBlock.created_at = formatDateTime(plainBlock.created_at)
        return plainBlock
    })

    let previousBlock = null

    formattedBlocks.forEach(currentBlock => {
        if (previousBlock === null) {
            previousBlock = currentBlock
        } else {
            const isHashValid = SHA.verifyHash(previousBlock, currentBlock.previous_hash)
            previousBlock = currentBlock
        }
    })
}

const view = (req, res) => {
    const name = req.session.name
    res.render('admin/user', { title: 'Pengaturan', name })
}

module.exports = {
    createGenesisBlock,
    view
}
