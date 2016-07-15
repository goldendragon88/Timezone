(function () {
  'use strict';

  // Timezones controller
  angular
    .module('timezones')
    .controller('TimezonesController', TimezonesController);

  TimezonesController.$inject = ['$scope', '$state', 'Authentication', 'timezoneResolve'];

  function TimezonesController ($scope, $state, Authentication, timezone) {
    var vm = this;

    $scope.format = 'dd-MMM-yyyy hh:mm:ss a';
    vm.authentication = Authentication;
    vm.timezone = timezone;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Timezone
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.timezone.$remove($state.go('timezones.list'));
      }
    }

    // Save Timezone
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.timezoneForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.timezone._id) {
        vm.timezone.$update(successCallback, errorCallback);
      } else {
        vm.timezone.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('timezones.view', {
          timezoneId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
})();
