module.exports = function UserManagment($q, $http, HttpUtil, UserManagmentFactory) {
  var srv = this

  function normalize(users) {
    return users.map(function(model) {
      return modelToUser(model)
    })
  }

  function modelToUser(model) {
    return new UserManagmentFactory(model)
  }

  srv.loadAll = function () {
    return $http.get('/app/api/v1/users')
      .then(HttpUtil.getDataOrReject('users'))
      .then(normalize)
  }

  /**
   * Add new user
   * @param {UserRegisterFactory} user A user object
   * @return {Promise} Promise returns an instance of
   *                   UserManagmentFactory object
   */
  srv.addUser = function(user) {
    return $http.post('/app/api/v1/users', user.toJSON())
      .then(HttpUtil.getDataOrReject('user'))
      .then(modelToUser)
  }

  srv.removeByEmail = function(email) {
    return $http.delete('/app/api/v1/users/' + email)
  }

  return srv
}
