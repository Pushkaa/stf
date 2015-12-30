module.exports = function UserRegisterFactory($http, HttpUtil, UserManagmentFactory) {

  function User(params) {
    params = params || {}
    UserManagmentFactory.call(this, params)
    this._password = params.password || ''
    this._password2 = params.password2 || ''
    this._isEmailValid = true
  }

  User.prototype = Object.create(UserManagmentFactory.prototype)

  Object.defineProperty(User.prototype, 'email', {
    get: function () {
      return this._email
    }
  , set: function (value) {
      this._email = value
    }
  })

  Object.defineProperty(User.prototype, 'name', {
    get: function () {
      return this._name
    }
  , set: function (value) {
      this._name = value
    }
  })

  Object.defineProperty(User.prototype, 'password', {
    get: function () {
      return this._password
    }
  , set: function (value) {
      this._password = value
    }
  })

  Object.defineProperty(User.prototype, 'password2', {
    get: function () {
      return this._password2
    }
  , set: function (value) {
      this._password2 = value
    }
  })

  Object.defineProperty(User.prototype, 'isValid', {
    value: function () {
      return this._name !== ''
        && this._email !== ''
        && this._password !== ''
        && this._password2 !== ''
        && (this._password === this._password2)
    }
  })

  Object.defineProperty(User.prototype, 'isEmailValid', {
    get: function () {
      return this._isEmailValid
    }
  })

  Object.defineProperty(User.prototype, 'validateEmail', {
    value: function () {
      var self = this
      if (this._email !== '') {
        $http.get('/app/api/v1/users/' + this._email)
          .then(HttpUtil.getData)
          .then(function(response) {
            self._isEmailValid = !response.success
          })
      }
    }
  })

  Object.defineProperty(User.prototype, 'toJSON', {
    value: function () {
      return {
        name: this._name
      , email: this._email
      , roles: this._roles.slice(0, this._roles.length)
      , password: this._password
      , password2: this._password2
      , isAdmin: this.isAdmin
      }
    }
  })

  return User
}
