module.exports = function UserRoleFilter () {
  return function(value) {
    if (Array.isArray(value)) {
      return ~value.indexOf('admin') ? 'Admin' : 'User'
    }
    return 'User'
  }
}
