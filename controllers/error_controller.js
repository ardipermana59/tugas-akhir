const forbidden_403 = (req, res) => {
    res.render('errors/403', { title: 'Data Pemilih', layout: false });
}


module.exports = {
    forbidden_403
};
