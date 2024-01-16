module.exports = (req, res, next) => {
  res.locals.success_msg = req.flash('success')

  next()
}