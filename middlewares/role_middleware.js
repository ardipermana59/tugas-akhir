const adminMiddleware = (req, res, next) => {
  const userRole = req.session.user ? req.session.user.role : null

  if (userRole != null && userRole === 'admin') {
    return next()
  }

  return res.redirect('/errors/403')
}


module.exports = {
  adminMiddleware,
}