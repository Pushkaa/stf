module.exports = function HttpUtilFactory($q) {
  var fac = {}

  fac.getDataOrReject = function (field) {
    return function(response) {
      var data = fac.getData(response)

      if (data.success) {
        return field ? data[field] : data
      } else {
        $q.reject(data)
      }
    }
  }

  fac.getData = function (response) {
    return response.data
  }

  return fac
}
