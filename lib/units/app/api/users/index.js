'use strict'

var express = require('express')
var router = express.Router()
var requireAdminRole = require('../../middleware/required-admin-role')

module.exports = function (options) {
  var controller = require('./users.controller')(options)

  router.get('/', controller.index)
  router.delete('/:email', controller.remove)
  return router
}
