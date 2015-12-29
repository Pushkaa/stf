module.exports =
  function AddUserModalServiceFactory($modal) {
    var service = {}

    var ModalInstanceCtrl = function ($scope, $modalInstance, user) {
      var ctrl = this
      ctrl.user = user

      $scope.ok = function () {
        $modalInstance.close(ctrl.user)
      }

      $scope.cancel = function () {
        $modalInstance.dismiss('cancel')
      }
    }

    service.open = function (user) {
      var modalInstance = $modal.open({
        template: require('./add-user-modal.jade'),
        controller: ModalInstanceCtrl,
        controllerAs: 'mv',
        resolve: {
          user: function () {
            return user
          }
        }
      })

      return modalInstance.result
    }

    return service
  }
