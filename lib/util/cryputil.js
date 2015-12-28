var crypto = require('crypto')
var jwtutil = require('./jwtutil')

module.exports.makeSalt = function() {
  return crypto.randomBytes(16).toString('base64')
}

module.exports.encrypt = function(text, salt) {
  var base64Salt = new Buffer(salt, 'base64')
  return crypto.pbkdf2Sync(text, base64Salt, 10000, 64).toString('base64')
}

module.exports.authenticate = function(hash, password, salt) {
  return this.encrypt(password, salt) === hash
}

module.exports.validateUser = function(user, password) {
  if (!user.salt || !user.password) {
    return false
  }
  return this.authenticate(user.password, password, user.salt)
}

module.exports.makeJWT = function(params) {
  return jwtutil.encode({
    payload: {
      email: params.email
    , name: params.name
    }
  , secret: params.secret
  })
}
