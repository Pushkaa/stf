var http = require('http')

var express = require('express')
var validator = require('express-validator')
var cookieSession = require('cookie-session')
var bodyParser = require('body-parser')
var serveStatic = require('serve-static')
var csrf = require('csurf')
var Promise = require('bluebird')

var logger = require('../../util/logger')
var requtil = require('../../util/requtil')
var jwtutil = require('../../util/jwtutil')
var pathutil = require('../../util/pathutil')
var urlutil = require('../../util/urlutil')
var cryputil = require('../../util/cryputil')
var lifecycle = require('../../util/lifecycle')
var dbapi = require('../../db/api')

module.exports = function(options) {
  var log = logger.createLogger('auth-local')
    , app = express()
    , server = Promise.promisifyAll(http.createServer(app))

  lifecycle.observe(function() {
    log.info('Waiting for client connections to end')
    return server.closeAsync()
      .catch(function() {
        // Okay
      })
  })

  app.set('view engine', 'jade')
  app.set('views', pathutil.resource('auth/local/views'))
  app.set('strict routing', true)
  app.set('case sensitive routing', true)

  app.use(cookieSession({
    name: options.ssid
  , keys: [options.secret]
  }))
  app.use(bodyParser.json())
  app.use(csrf())
  app.use(validator())
  app.use('/static/bower_components',
    serveStatic(pathutil.resource('bower_components')))
  app.use('/static/auth/local', serveStatic(pathutil.resource('auth/local')))

  app.use(function(req, res, next) {
    res.cookie('XSRF-TOKEN', req.csrfToken())
    next()
  })

  app.get('/', function(req, res) {
    res.redirect('/auth/local/')
  })

  app.get('/auth/local/', function(req, res) {
    res.render('index')
  })

  app.get('/auth/local/register/', function(req, res) {
    res.render('index')
  })

  app.post('/auth/api/v1/local', function(req, res) {
    var log = logger.createLogger('auth-local')
    log.setLocalIdentifier(req.ip)

    if (!req.accepts('json')) {
      return res.status(200).send(406)
    }

    requtil.validate(req, function() {
      req.checkBody('email').isEmail()
      req.checkBody('password').notEmpty()
    })
      .then(function() {
        dbapi.loadUser(req.body.email)
          .then(function(user) {
            if (!user) {
              return res.status(400).json({
                success: false
              , error: 'AuthenticationError'
              })
            }
            // validate user
            if (cryputil.validateUser(user, req.body.password)) {
              return res.status(200).json({
                success: true
              , redirect: urlutil.addParams(options.appUrl, {
                  jwt: cryputil.makeJWT({
                    name: user.name
                  , email: user.email
                  , secret: options.secret
                  })
                })
              })
            } else {
              return res.status(400).json({
                success: false
              , error: 'ValidationError'
              })
            }
          })
      })
      .catch(function(err) {
        res.status(400).json({
          success: false
        , error: 'ValidationError'
        })
      })
  })

  app.post('/auth/api/v1/local/register', function(req, res) {
    var log = logger.createLogger('auth-local')
    log.setLocalIdentifier(req.ip)

    if (!req.accepts('json')) {
      return res.status(200).send(406)
    }

    requtil.validate(req, function() {
      req.checkBody('name').notEmpty()
      req.checkBody('email').isEmail()
      req.checkBody('password').notEmpty()
      req.checkBody('password2').notEmpty()
    })
      .then(function() {
        dbapi.loadUser(req.body.email)
          .then(function(user) {
            if (user) {
              return res.status(400).json({
                success: false
              , error: 'RegisterError'
              })
            } else {
              var salt = cryputil.makeSalt()
              dbapi.createUser({
                name: req.body.name
              , email: req.body.email
              , password: cryputil.encrypt(req.body.password, salt)
              , roles: ['user']
              , salt: salt
              , ip: req.ip
              })
              .then(function(stats) {
                if (stats.inserted) {
                  return res.status(201).json({
                    success: true
                  , redirect: '/auth/local/'
                  })
                } else {
                  return res.status(400).json({
                    success: false
                  , error: 'RegisterError'
                  })
                }
              })
            }
          })
      })
  })

  // function requiredAdmin(req, res, next) {
  //   var user = req.user
  //   console.log(req.session.user)
  //   var roles = user.roles || []

  //   if (~roles.indexOf('admin')) {
  //     next()
  //   }
  //   else {
  //     res.status(401).json({
  //       success: false
  //     , error: 'AuthenticationError'
  //     })
  //   }
  // }

  // app.get('/auth/api/v1/local/users', requiredAdmin, function(req, res) {
  //   dbapi.loadUsers()
  //     .then(function(users) {
  //       res.status(200).json({
  //         success: true
  //       , users: users
  //       })
  //     })
  //     .catch(function() {
  //       res.status(500).json({
  //         success: false
  //       , error: 'InternalServerError'
  //       })
  //     })
  // })

  app.get('/auth/api/v1/local/logout', function(req, res) {
    req.session = null
    res.redirect(options.appUrl)
  })

  server.listen(options.port)
  log.info('Listening on port %d', options.port)
}
