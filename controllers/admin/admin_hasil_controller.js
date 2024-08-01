const view = (req, res) => {
    res.render('admin/hasil', { title: 'Hasil' });
}

const generateHasil = (req, res) => {
    res.render('admin/hasil', { title: 'Hasil' });
}

module.exports = {
    generateHasil,
    view
};
