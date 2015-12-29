'use strict'
var dbapi = require('../../../../db/api')
var requtil = require('../../../../util/requtil')

module.exports = function(options) {
  var ctrl = {}

  ctrl.index = function (req, res) {
    dbapi.loadUsers()
      .then(function(cursor) {
        cursor.toArray()
          .then(function(users) {
            res.status(200).json({
              success: true
            , users: users
            })
          })
      })
      .catch(function(err) {
        log.error('Failed to load device list: ', err.stack)
        res.status(500).json({
          success: false
        })
      })
  }

  ctrl.remove = function(req, res) {
    requtil.validate(req, function() {
      req.checkParams('email').isEmail()
    })
    .then(function() {
      dbapi.removeUserByEmail(req.params.email)
        .then(function(stats) {
          if (stats.deleted) {
            res.status(204).send(204)
          } else {
            res.status(404).json({
              success: false
            , error: 'NotFoundError'
            })
          }
        })
    })
    .catch(function() {
      res.status(400).json({
        success: false
      , error: 'ValidationError'
      })
    })
  }

  return ctrl
}

