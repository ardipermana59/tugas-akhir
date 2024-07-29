const { Op } = require('sequelize');
const { v4: uuidv4 } = require('uuid');

const { Pemilih } = require('../../models');
const { getPaginatedData } = require('../../utils');

const view = (req, res) => {
  res.render('admin/pemilih', { title: 'Data Pemilih' });
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
        Pemilih, whereCondition, start, length, order
      );

      res.json({
          draw: parseInt(req.query.draw),
          recordsTotal: recordsTotal,
          recordsFiltered: recordsFiltered,
          data: data
      });
      console.log(data)
  } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {
  view,
  getData
};
