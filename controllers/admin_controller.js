const dashboardView = (req, res) => {
  res.render('admin/dashboard', { title: 'Dashboard' });
}

const userView = (req, res) => {
  res.render('admin/user', { title: 'Data User' });
}

const kandidatView = (req, res) => {
  res.render('admin/user', { title: 'Data Kandidat' });
}

const pemilihView = (req, res) => {
  res.render('admin/user', { title: 'Data Pemilih' });
}

const settingView = (req, res) => {
  res.render('admin/user', { title: 'Pengaturan' });
}


module.exports = {
  dashboardView,
  userView,
  kandidatView,
  pemilihView,
  settingView,
};
