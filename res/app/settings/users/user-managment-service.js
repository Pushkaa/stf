module.exports = function UserManagment($q, $http, UserManagmentFactory) {
  var srv = this

  function getData(response) {
    var data = response.data

    if (data.success) {
      return data.users
    } else {
      $q.reject(data)
    }
  }

  function normalize(users) {
    return users.map(function(model) {
      return new UserManagmentFactory(model)
    })
  }

  srv.loadAll = function () {
    return $http.get('/app/api/v1/users')
      .then(getData)
      .then(normalize)
  }

  srv.removeByEmail = function(email) {
    return $http.delete('/app/api/v1/users/' + email)
  }

  return srv
}
