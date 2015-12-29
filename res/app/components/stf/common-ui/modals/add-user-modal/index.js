module.exports = angular.module('stf.add-user-modal', [
  require('stf/common-ui/modals/common').name
])
  .factory('AddUserModalService', require('./add-user-modal-service'))
