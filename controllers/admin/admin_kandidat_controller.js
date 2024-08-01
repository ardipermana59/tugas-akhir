const { Op } = require('sequelize');
const { v4: uuidv4 } = require('uuid');

const { Kandidat } = require('../../models');
const { getPaginatedData } = require('../../utils');

const view = (req, res) => {
  res.render('admin/kandidat', { title: 'Data Kandidat' });
}

const getData = async (req, res) => {
  try {
      const search = req.query.name || '';
      const start = parseInt(req.query.start) || 0;
      const length = parseInt(req.query.length) || 10;

      const order = [];
      if (req.query.order) {
          req.query.order.forEach(o => {
              order.push([req.query.columns[o.column].data, o.dir.toUpperCase()]);
          });
      }

      const whereCondition = {
          name: {
              [Op.like]: `%${search}%`
          }
      };

      const { recordsTotal, recordsFiltered, data } = await getPaginatedData(
        Kandidat, whereCondition, start, length, order
      );

      res.json({
          draw: parseInt(req.query.draw),
          recordsTotal: recordsTotal,
          recordsFiltered: recordsFiltered,
          data: data
      });
  } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getDataById = async (req, res) => {
  const id = req.params.id;

  try {
      const data = await Kandidat.findOne({
          where: {
              id
          }
      });

      if (!data) {
          return res.status(404).json({ error: 'Data not found' });
      }
      
      res.status(200).json(data);
  } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
  }
};

const addData = async (req, res) => {
  const { name } = req.body;

  try {
    await Kandidat.create({
      id: uuidv4(),
      name,
      foto: 'prabowo.jpg'
    });

    res.status(201).json({ message: 'Admin has been added.' });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const updateData = async (req, res) => {
  const id = req.params.id;
  const { name } = req.body;

  try {
      const data = await Kandidat.findOne({
          where: {
              id: id,
          }
      });
     
      if (!data) {
          return res.status(404).json({ error: 'Data not found' });
      }

      data.name = name;
      await data.save();

      res.status(200).json({ message: 'Data has been updated.' });
  } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
  }
};

const destroy = async (req, res) => {
  const id = req.params.id;

  try {
    const deletedData = await Kandidat.destroy({
      where: {
        id: id
      }
    });

    if (deletedData === 1) {
      return res.status(200).json({ message: 'Data has been deleted.' });
    } else {
      return res.status(404).json({ error: 'Data not found.' });
    }
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = {
  view,
  getData,
  getDataById,
  addData,
  updateData,
  destroy,
};
