module.exports = function UsersCtrl(
  UserManagment,
  UserRegisterFactory,
  AddUserModalService
) {
  var ctrl = this
  var cachedUser

  ctrl.users = []

  UserManagment.loadAll()
    .then(function(/*UserManagmentFactory*/ users) {
      ctrl.users = users
    })

  ctrl.openAddUserModal = function() {
    AddUserModalService.open(cachedUser || (new UserRegisterFactory()))
      .then(function(user) {
        // cache user object, if there is any error we will pass this object
        // into a modal so user won't lost his data
        cachedUser = user
        return UserManagment.addUser(user)
      })
      .then(function(user) {
        cachedUser = null
        ctrl.users[ctrl.users.length] = user
      })
  }

  /**
   * Removes given user
   * @param  {UserManagmentFactory} user User object
   * @return {Promise}
   */
  ctrl.remove = function(user) {
    return UserManagment.removeByEmail(user.email)
      .then(function() {
        ctrl.users.splice(ctrl.users.indexOf(user), 1)
      })
  }

  return ctrl
}
