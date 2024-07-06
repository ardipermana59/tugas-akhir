const { User } = require('../../models');
const { getPaginatedData } = require('../../utils');

const getUser = async (req, res) => {
    try {
        const search = req.query.username || '';
        const start = parseInt(req.query.start) || 0;
        const length = parseInt(req.query.length) || 10;

        const order = [];
        if (req.query.order) {
            req.query.order.forEach(o => {
                order.push([req.query.columns[o.column].data, o.dir.toUpperCase()]);
            });
        }

        const { recordsTotal, recordsFiltered, data } = await getPaginatedData(
            User, search, 'username', start, length, order
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

module.exports = {
    getUser
};
