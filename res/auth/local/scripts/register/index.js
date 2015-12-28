require('./register.css')

module.exports = angular.module('stf.register', [])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/auth/local/register/', {
        template: require('./register.jade')
      })
  })
  .controller('RegisterInCtrl', require('./register-controller'))
