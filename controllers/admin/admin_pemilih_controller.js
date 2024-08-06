const { Op } = require('sequelize')
const { v4: uuidv4 } = require('uuid')

const { Pemilih } = require('../../models')
const { getPaginatedData } = require('../../utils')

const view = (req, res) => {
  const name = req.session.name
  res.render('admin/pemilih', { title: 'Data Pemilih', name })
}

const getData = async (req, res) => {
  try {
    const search = req.query.name || ''
    const start = parseInt(req.query.start) || 0
    const length = parseInt(req.query.length) || 10

    const order = []
    if (req.query.order) {
      req.query.order.forEach(o => {
        order.push([req.query.columns[o.column].data, o.dir.toUpperCase()])
      })
    }

    const whereCondition = {
      name: {
        [Op.like]: `%${search}%`
      }
    }

    const { recordsTotal, recordsFiltered, data } = await getPaginatedData(
      Pemilih, whereCondition, start, length, order
    )

    res.json({
      draw: parseInt(req.query.draw),
      recordsTotal: recordsTotal,
      recordsFiltered: recordsFiltered,
      data: data
    })
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' })
  }
}

const getDataById = async (req, res) => {
  const id = req.params.id

  try {
      const data = await Pemilih.findOne({
          where: {
              id
          }
      })

      if (!data) {
          return res.status(404).json({ error: 'Data not found' })
      }
      
      res.status(200).json(data)
  } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' })
  }
}
const addData = async (req, res) => {
  const { name, gender, address } = req.body

  try {
    await Pemilih.create({
      id: uuidv4(),
      name,
      gender,
      address
    })

    res.status(201).json({ message: 'Admin has been added.' })
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' })
  }
}

const updateData = async (req, res) => {
  const id = req.params.id
  const { name, gender, address } = req.body

  try {
      const data = await Pemilih.findOne({
          where: {
              id: id,
          }
      })
     
      if (!data) {
          return res.status(404).json({ error: 'Data not found' })
      }

      data.name = name
      data.gender = gender
      data.address = address
      await data.save()

      res.status(200).json({ message: 'Data has been updated.' })
  } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' })
  }
}

const destroy = async (req, res) => {
  const id = req.params.id

  try {
    const deletedData = await Pemilih.destroy({
      where: {
        id: id
      }
    })

    if (deletedData === 1) {
      return res.status(200).json({ message: 'Data has been deleted.' })
    } else {
      return res.status(404).json({ error: 'Data not found.' })
    }
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' })
  }
}
module.exports = {
  view,
  getData,
  getDataById,
  addData,
  updateData,
  destroy,
}
