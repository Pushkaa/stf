module.exports = function (options) {
  return function(req, res, next) {
    var user = req.user
    var roles = user.roles || []
    console.log(roles)
    if (~roles.indexOf('admin')) {
      next()
    }
    else {
      res.status(401).json({
        success: false
      , error: 'AuthenticationError'
      })
    }
  }
}
