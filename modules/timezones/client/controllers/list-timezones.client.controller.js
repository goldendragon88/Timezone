(function () {
  'use strict';

  angular
    .module('timezones')
    .controller('TimezonesListController', TimezonesListController);

  TimezonesListController.$inject = ['TimezonesService', '$scope'];

  function TimezonesListController(TimezonesService, $scope) {
    var vm = this;

    $scope.format = 'dd-MMM-yyyy hh:mm:ss a';
    vm.timezones = TimezonesService.query();
    // vm.dateTimeNow = moment();
  }
})();
