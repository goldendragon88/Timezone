//Timezones service used to communicate Timezones REST endpoints
(function () {
  'use strict';

  angular
    .module('timezones')
    .factory('TimezonesService', TimezonesService);

  TimezonesService.$inject = ['$resource'];

  function TimezonesService($resource) {
    return $resource('api/timezones/:timezoneId', {
      timezoneId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }

  // Create the instant search filter
  angular
    .module('timezones')
    .filter('searchFor', function(){

      // All filters must return a function. The first parameter
      // is the data that is to be filtered, and the second is an
      // argument that may be passed with a colon (searchFor:searchString)

      return function(arr, searchString){

        if(!searchString){
          return arr;
        }

        var result = [];

        searchString = searchString.toLowerCase();

        // Using the forEach helper method to loop through the array
        angular.forEach(arr, function(item){

          if(item.name.toLowerCase().indexOf(searchString) !== -1){
            result.push(item);
          }

        });

        return result;
      };

    });

  // angular
  //   .module('timezones')
  //   .filter('toUserTimezone', function() {
  //     return function(input, format, offset) {

  //       var output, timezoneText, inputCopy;
        
  //       // we need to copy the object so we don't cause any side-effects
  //       inputCopy = angular.copy(input);

  //       // check to make sure a moment object was passed
  //       if (!moment.isMoment(inputCopy)) {
  //         // do nothing
  //         return input;

  //       } else {
  //         // set default offset change to 0
  //         offset = offset || 0;

  //         // change the time by the offet  
  //         inputCopy.add(offset, 'hours');

  //         // this will need to be improved so the added text is in the format +hh:mm
  //         offset >= 0 ? timezoneText = '+' + offset : timezoneText = offset;
          
  //         // format the output to the requested format and add the timezone 
  //         output = inputCopy.format(format) + ' ' + timezoneText;

  //         return output;
  //       }
  //     };
  //   });

})();
