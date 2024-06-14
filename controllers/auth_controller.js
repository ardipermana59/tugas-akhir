const bcrypt = require('bcrypt');
const { User } = require('../models')

const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ where: { username } });
    if (!user) {
      return res.render('auth/login', { message: 'Invalid username or password' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.render('auth/login', { message: 'Invalid username or password' });
    }

    req.session.user = user;

    res.redirect('/');
  } catch (error) {
    res.render('auth/login', { message: 'Internal server error' });
  }
};

const loginView = async (req, res) => {
  const user = req.session.user;

  if (!user) {
    return res.render('auth/login');
  }

  return res.redirect('/');
}

const logout = (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).send('Unable to log out');
    }

    res.redirect('/login');
  });
};

module.exports = {
  login,
  loginView,
  logout
};
