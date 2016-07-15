(function () {
  'use strict';

  angular
    .module('timezones')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('home', {
        url: '/',
        templateUrl: 'modules/timezones/client/views/list-timezones.client.view.html',
        controller: 'TimezonesListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Timezones List'
        }
      })
      .state('timezones', {
        abstract: true,
        url: '/timezones',
        template: '<ui-view/>'
      })
      .state('timezones.list', {
        url: '',
        templateUrl: 'modules/timezones/client/views/list-timezones.client.view.html',
        controller: 'TimezonesListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Timezones List'
        }
      })
      .state('timezones.create', {
        url: '/create',
        templateUrl: 'modules/timezones/client/views/form-timezone.client.view.html',
        controller: 'TimezonesController',
        controllerAs: 'vm',
        resolve: {
          timezoneResolve: newTimezone
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle : 'Timezones Create'
        }
      })
      .state('timezones.edit', {
        url: '/:timezoneId/edit',
        templateUrl: 'modules/timezones/client/views/form-timezone.client.view.html',
        controller: 'TimezonesController',
        controllerAs: 'vm',
        resolve: {
          timezoneResolve: getTimezone
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Timezone {{ timezoneResolve.name }}'
        }
      })
      .state('timezones.view', {
        url: '/:timezoneId',
        templateUrl: 'modules/timezones/client/views/view-timezone.client.view.html',
        controller: 'TimezonesController',
        controllerAs: 'vm',
        resolve: {
          timezoneResolve: getTimezone
        },
        data:{
          pageTitle: 'Timezone {{ articleResolve.name }}'
        }
      });
  }

  getTimezone.$inject = ['$stateParams', 'TimezonesService'];

  function getTimezone($stateParams, TimezonesService) {
    return TimezonesService.get({
      timezoneId: $stateParams.timezoneId
    }).$promise;
  }

  newTimezone.$inject = ['TimezonesService'];

  function newTimezone(TimezonesService) {
    return new TimezonesService();
  }
})();
