'use strict'
var dbapi = require('../../../../db/api')
var requtil = require('../../../../util/requtil')
var cryputil = require('../../../../util/cryputil')

module.exports = function(options) {
  var ctrl = {}

  ctrl.get = function(req, res) {
    dbapi.loadUser(req.params.email)
      .then(function(user) {
        if (user) {
          res.status(200).json({
            success: true
          })
        } else {
          res.status(200).json({
            success: false
          , error: 'NotFoundError'
          })
        }
      })
      .catch(function() {
        res.status(500).json({
          success: false
        , error: 'InternalServerError'
        })
      })
  }

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

  ctrl.create = function(req, res) {
    if (!req.accepts('json')) {
      return res.status(200).send(406)
    }

    requtil.validate(req, function() {
      req.checkBody('name').notEmpty()
      req.checkBody('email').isEmail()
      // req.checkBody('roles').isArray()
      req.checkBody('password').notEmpty()
      req.checkBody('password2').notEmpty()
    })
    .then(function() {
      dbapi.loadUser(req.body.email)
        .then(function(user) {
          if (user) {
            return res.status(400).json({
              success: false
            , error: 'DuplicationError'
            })
          } else {
            var salt = cryputil.makeSalt()
            var model = {
              name: req.body.name
            , email: req.body.email
            , password: cryputil.encrypt(req.body.password, salt)
            , roles: req.body.roles
            , salt: salt
            , ip: req.ip
            }

            dbapi.createUser(model)
            .then(function(stats) {
              if (stats.inserted) {
                dbapi.loadUser(model.email)
                  .then(function(user) {
                    return res.status(201).json({
                      success: true
                    , user: user
                    })
                  })
              } else {
                return res.status(400).json({
                  success: false
                , error: 'RegisterError'
                })
              }
            })
            .catch(function() {
              res.status(500).json({
                success: false
              , error: 'InternalServerError'
              })
            })
          }
        })
    })
    .catch(function(error) {
      res.status(400).json({
        success: false
      , error: error
      })
    })
  }

  return ctrl
}

