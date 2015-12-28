module.exports = function SignInCtrl($scope, $http) {

  $scope.error = null

  $scope.submit = function () {
    var data = {
      email: $scope.signin.email.$modelValue
    , password: $scope.signin.password.$modelValue
    }
    $scope.invalid = false
    $http.post('/auth/api/v1/local', data)
      .success(function (response) {
        $scope.error = null
        location.replace(response.redirect)
      })
      .error(function (response) {
        switch (response.error) {
          case 'ValidationError':
            $scope.error = {
              $invalid: true
            }
            break
          case 'InvalidCredentialsError':
            $scope.error = {
              $incorrect: true
            }
            break
          default:
            $scope.error = {
              $server: true
            }
            break
        }
      })
  }
}
