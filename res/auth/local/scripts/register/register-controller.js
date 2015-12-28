module.exports = function RegisterInCtrl($scope, $http) {

  $scope.error = null

  $scope.submit = function () {
    var data = {
      email: $scope.signin.email.$modelValue
    , name: $scope.signin.username.$modelValue
    , password: $scope.signin.password.$modelValue
    , password2: $scope.signin.password2.$modelValue
    }

    $scope.invalid = false
    $http.post('/auth/api/v1/local/register', data)
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
