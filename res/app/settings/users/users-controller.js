module.exports = function UsersCtrl(
  UserManagment,
  UserRegisterFactory,
  AddUserModalService
) {
  var ctrl = this

  ctrl.users = []

  UserManagment.loadAll()
    .then(function(/*UserManagmentFactory*/ users) {
      ctrl.users = users
    })

  ctrl.openAddUserModal = function() {
    AddUserModalService.open(new UserRegisterFactory({}))
      .then(function(user) {
        if (user instanceof UserRegisterFactory) {
          console.log('OK')
        }
      })
  }

  /**
   * Removes given user
   * @param  {UserManagmentFactory} user User object
   * @return {Promise}
   */
  ctrl.remove = function(user) {
    return UserManagment.removeByEmail(user.email)
      .then(function(response) {
        ctrl.users.splice(ctrl.users.indexOf(user), 1)
      })
  }

  return ctrl
}
