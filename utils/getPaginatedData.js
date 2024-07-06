const { Op } = require('sequelize');

const getPaginatedData = async (Model, searchQuery, searchField, start, length, order) => {
    const whereCondition = searchQuery
        ? { [searchField]: { [Op.like]: `%${searchQuery}%` } }
        : {};

    const { count: recordsTotal } = await Model.findAndCountAll();
    const { count: recordsFiltered, rows: data } = await Model.findAndCountAll({
        where: whereCondition,
        offset: start,
        limit: length,
        order: order
    });

    return { recordsTotal, recordsFiltered, data };
};

module.exports = {
    getPaginatedData
};
