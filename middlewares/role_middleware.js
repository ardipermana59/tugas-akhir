const adminMiddleware = (req, res, next) => {
  const userRole = req.user ? req.user.role : null;

  if (userRole && userRole === 'admin') {
    return next();
  }

  return res.redirect('/errors/403')
};


module.exports = {
  adminMiddleware,
};