require('./users.css')

module.exports = angular.module('stf.settings.users', [
  require('stf/common-ui').name
])
  .run(["$templateCache", function ($templateCache) {
    $templateCache.put(
      'settings/users/users.jade'
      , require('./users.jade')
    )
  }])
  .service('UserManagment', require('./user-managment-service'))
  .factory('UserManagmentFactory', require('./user-managment-factory'))
  .factory('UserRegisterFactory', require('./user-register-factory'))
  .filter('userole', require('./user-role-filter'))
  .controller('UsersCtrl', require('./users-controller'))
