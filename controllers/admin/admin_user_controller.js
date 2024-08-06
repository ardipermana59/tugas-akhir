const { Op } = require('sequelize')
const { v4: uuidv4 } = require('uuid')
const bcrypt = require('bcrypt')

const { User } = require('../../models')
const { getPaginatedData } = require('../../utils')

const view = (req, res) => {
    const name = req.session.name
    res.render('admin/admin/index', { title: 'Data Admin', name })
}

const getData = async (req, res) => {
    try {
        const search = req.query.username || ''
        const start = parseInt(req.query.start) || 0
        const length = parseInt(req.query.length) || 10

        const order = []
        if (req.query.order) {
            req.query.order.forEach(o => {
                order.push([req.query.columns[o.column].data, o.dir.toUpperCase()])
            })
        }

        const whereCondition = {
            role: 'admin',
            username: {
                [Op.like]: `%${search}%`
            }
        }

        const { recordsTotal, recordsFiltered, data } = await getPaginatedData(
            User, whereCondition, start, length, order
        )

        res.json({
            draw: parseInt(req.query.draw),
            recordsTotal: recordsTotal,
            recordsFiltered: recordsFiltered,
            data: data
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Internal Server Error' })
    }
}

const getAdminById = async (req, res) => {
    const userId = req.params.id

    try {
        const user = await User.findOne({
            where: {
                id: userId,
                role: 'admin'
            }
        })

        if (!user) {
            return res.status(404).json({ error: 'Admin not found' })
        }

        res.status(200).json(user)
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Internal Server Error' })
    }
}

const addAdmin = async (req, res) => {
    const { username, password } = req.body

    try {
        const existingUser = await User.findOne({
            where: {
                username: username
            }
        })

        if (existingUser) {
            return res.status(400).json({ error: 'Username already exists' })
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const newUser = await User.create({
            id: uuidv4(),
            username: username.replace(/\s+/g, ''),
            password: hashedPassword,
            role: 'admin'
        })

        res.status(201).json({ message: 'Admin has been added.', user: newUser })
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Internal Server Error' })
    }
}


const updateAdmin = async (req, res) => {
    const userId = req.params.id
    const { username, password } = req.body

    try {
        const user = await User.findOne({
            where: {
                id: userId,
                role: 'admin'
            }
        })

        if (!user) {
            return res.status(404).json({ error: 'Admin not found' })
        }

        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10)
            user.password = hashedPassword
        }

        user.username = username.replace(/\s+/g, '')
        await user.save()

        res.status(200).json({ message: 'Admin has been updated.' })
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Internal Server Error' })
    }
}


const destroy = async (req, res) => {
    const userId = req.params.id

    try {
        const deletedUser = await User.destroy({
            where: {
                id: userId,
                role: 'admin'
            }
        })

        if (deletedUser === 1) {
            return res.status(200).json({ message: 'Admin has been deleted.' })
        } else {
            return res.status(404).json({ error: 'Admin not found.' })
        }
    } catch (error) {
        console.error(error)
        return res.status(500).json({ error: 'Internal server error' })
    }
}

module.exports = {
    view,
    getData,
    getAdminById,
    addAdmin,
    updateAdmin,
    destroy
}
