module.exports = function UserRegisterFactory(UserManagmentFactory) {

  function User(params) {
    UserManagmentFactory.call(this, params)
    this._password = params.password
    this._password2 = params.password2
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

  Object.defineProperty(User.prototype, 'toJSON', {
    value: function () {
      return {
        name: this._name
      , email: this._email
      , password: this._password
      , password2: this._password2
      , isAdmin: this.isAdmin
      }
    }
  })

  return User
}
