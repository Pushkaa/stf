module.exports =
  function AddUserModalServiceFactory($modal) {
    var service = {}

    var ModalInstanceCtrl = function ($scope, $modalInstance, user) {
      var ctrl = this
      ctrl.user = user

      ctrl.ok = function () {
        $modalInstance.close(ctrl.user)
      }

      ctrl.cancel = function () {
        $modalInstance.dismiss('cancel')
      }

      ctrl.toggleUserAdminRole = function() {
        if (ctrl.user.isAdmin) {
          ctrl.user.removeRoles('admin')
        } else {
          ctrl.user.addRoles('admin')
        }
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
