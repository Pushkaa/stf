var crypto = require('crypto')
var r = require('rethinkdb')
var dbapi = require('../../db/api')
var db = require('../../db')

function makeSalt() {
  return crypto.randomBytes(16).toString('base64')
}

function encrypt(text, salt) {
  var base64Salt = new Buffer(salt, 'base64')
  return crypto.pbkdf2Sync(text, base64Salt, 10000, 64).toString('base64')
}

function authenticate(hashedPassword, plainTextPassword, salt) {
  return encrypt(plainTextPassword, salt) === hashedPassword
}

function validateUser(user, plainTextPassword) {
  if (!user.salt || !user.password) {
    return false
  }

  return authenticate(user.password, plainTextPassword, user.salt)
}
module.exports = function(options) {
  db.run(r.table('users').filter(r.row('roles').contains('admin')).delete())
    .then(function() {
      var salt = makeSalt()
      dbapi.createUser({
        name: options.username
      , email: options.email
      , password: encrypt(options.password, salt)
      , roles: ['admin']
      , salt: salt
      , ip: '127.0.0.1'
      })
      .then(function(stats) {
        if (stats.errors) {
          return console.error('Error! Something went wrong')
        } else if (stats.inserted) {
          return console.log('Admin was succesfully added')
        } else {
          return console.error('Error! Unknown error')
        }
      })
      .catch(function() {
        return console.error('Error! Make sure your rethinkDB is running')
      })
    })

}
