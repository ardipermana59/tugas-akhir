const getPaginatedData = async (Model, whereCondition, start, length, order) => {
    const { count: recordsTotal } = await Model.findAndCountAll()
    const { count: recordsFiltered, rows: data } = await Model.findAndCountAll({
        where: whereCondition,
        offset: start,
        limit: length,
        order: order
    })

    return { recordsTotal, recordsFiltered, data }
}

module.exports = {
    getPaginatedData
}

