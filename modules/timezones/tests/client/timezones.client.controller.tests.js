(function () {
  'use strict';

  describe('Timezones Controller Tests', function () {
    // Initialize global variables
    var TimezonesController,
      $scope,
      $httpBackend,
      $state,
      Authentication,
      TimezonesService,
      mockTimezone;

    // The $resource service augments the response object with methods for updating and deleting the resource.
    // If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
    // the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
    // When the toEqualData matcher compares two objects, it takes only object properties into
    // account and ignores methods.
    beforeEach(function () {
      jasmine.addMatchers({
        toEqualData: function (util, customEqualityTesters) {
          return {
            compare: function (actual, expected) {
              return {
                pass: angular.equals(actual, expected)
              };
            }
          };
        }
      });
    });

    // Then we can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($controller, $rootScope, _$state_, _$httpBackend_, _Authentication_, _TimezonesService_) {
      // Set a new global scope
      $scope = $rootScope.$new();

      // Point global variables to injected services
      $httpBackend = _$httpBackend_;
      $state = _$state_;
      Authentication = _Authentication_;
      TimezonesService = _TimezonesService_;

      // create mock Timezone
      mockTimezone = new TimezonesService({
        _id: '525a8422f6d0f87f0e407a33',
        name: 'Timezone Name'
      });

      // Mock logged in user
      Authentication.user = {
        roles: ['user']
      };

      // Initialize the Timezones controller.
      TimezonesController = $controller('TimezonesController as vm', {
        $scope: $scope,
        timezoneResolve: {}
      });

      //Spy on state go
      spyOn($state, 'go');
    }));

    describe('vm.save() as create', function () {
      var sampleTimezonePostData;

      beforeEach(function () {
        // Create a sample Timezone object
        sampleTimezonePostData = new TimezonesService({
          name: 'Timezone Name'
        });

        $scope.vm.timezone = sampleTimezonePostData;
      });

      it('should send a POST request with the form input values and then locate to new object URL', inject(function (TimezonesService) {
        // Set POST response
        $httpBackend.expectPOST('api/timezones', sampleTimezonePostData).respond(mockTimezone);

        // Run controller functionality
        $scope.vm.save(true);
        $httpBackend.flush();

        // Test URL redirection after the Timezone was created
        expect($state.go).toHaveBeenCalledWith('timezones.view', {
          timezoneId: mockTimezone._id
        });
      }));

      it('should set $scope.vm.error if error', function () {
        var errorMessage = 'this is an error message';
        $httpBackend.expectPOST('api/timezones', sampleTimezonePostData).respond(400, {
          message: errorMessage
        });

        $scope.vm.save(true);
        $httpBackend.flush();

        expect($scope.vm.error).toBe(errorMessage);
      });
    });

    describe('vm.save() as update', function () {
      beforeEach(function () {
        // Mock Timezone in $scope
        $scope.vm.timezone = mockTimezone;
      });

      it('should update a valid Timezone', inject(function (TimezonesService) {
        // Set PUT response
        $httpBackend.expectPUT(/api\/timezones\/([0-9a-fA-F]{24})$/).respond();

        // Run controller functionality
        $scope.vm.save(true);
        $httpBackend.flush();

        // Test URL location to new object
        expect($state.go).toHaveBeenCalledWith('timezones.view', {
          timezoneId: mockTimezone._id
        });
      }));

      it('should set $scope.vm.error if error', inject(function (TimezonesService) {
        var errorMessage = 'error';
        $httpBackend.expectPUT(/api\/timezones\/([0-9a-fA-F]{24})$/).respond(400, {
          message: errorMessage
        });

        $scope.vm.save(true);
        $httpBackend.flush();

        expect($scope.vm.error).toBe(errorMessage);
      }));
    });

    describe('vm.remove()', function () {
      beforeEach(function () {
        //Setup Timezones
        $scope.vm.timezone = mockTimezone;
      });

      it('should delete the Timezone and redirect to Timezones', function () {
        //Return true on confirm message
        spyOn(window, 'confirm').and.returnValue(true);

        $httpBackend.expectDELETE(/api\/timezones\/([0-9a-fA-F]{24})$/).respond(204);

        $scope.vm.remove();
        $httpBackend.flush();

        expect($state.go).toHaveBeenCalledWith('timezones.list');
      });

      it('should should not delete the Timezone and not redirect', function () {
        //Return false on confirm message
        spyOn(window, 'confirm').and.returnValue(false);

        $scope.vm.remove();

        expect($state.go).not.toHaveBeenCalled();
      });
    });
  });
})();
