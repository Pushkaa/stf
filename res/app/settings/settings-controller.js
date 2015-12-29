module.exports = function SettingsCtrl($scope, gettext, UserService) {
  var user = UserService.currentUser
  var userRoles = user.roles || []

  $scope.settingTabs = [
    {
      title: gettext('General'),
      icon: 'fa-gears fa-fw',
      templateUrl: 'settings/general/general.jade'
    },
    {
      title: gettext('Keys'),
      icon: 'fa-key fa-fw',
      templateUrl: 'settings/keys/keys.jade'
    }
  ]

  if (~userRoles.indexOf('admin')) {
    $scope.settingTabs.push({
      title: gettext('Users'),
      icon: 'fa-users fa-fw',
      templateUrl: 'settings/users/users.jade'
    })
  }
}
