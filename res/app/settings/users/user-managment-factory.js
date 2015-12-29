module.exports = function UserManagmentFactory(UserService) {
  var currentUser = UserService.currentUser

  function User(params) {
    this._email = params.email || ''
    this._roles = params.roles || []
    this._name = params.name || ''
    this._ip = params.ip || ''
    this._createdAt = params.createdAt || null
    this._lastLoggedInAt = params.lastLoggedInAt || null
  }

  Object.defineProperty(User.prototype, 'email', {
    get: function () {
      return this._email
    }
  })

  Object.defineProperty(User.prototype, 'name', {
    get: function () {
      return this._name
    }
  })

  Object.defineProperty(User.prototype, 'roles', {
    get: function () {
      return this._roles
    }
  })

  Object.defineProperty(User.prototype, 'ip', {
    get: function () {
      return this._ip
    }
  })

  Object.defineProperty(User.prototype, 'createdAt', {
    get: function () {
      return this._createdAt
    }
  })

  Object.defineProperty(User.prototype, 'lastLoggedInAt', {
    get: function () {
      return this._lastLoggedInAt
    }
  })

  Object.defineProperty(User.prototype, 'isAdmin', {
    get: function () {
      return ~this._roles.indexOf('admin')
    }
  })

  Object.defineProperty(User.prototype, 'isCurrent', {
    get: function () {
      return currentUser.email === this._email
    }
  })



  return User
}
