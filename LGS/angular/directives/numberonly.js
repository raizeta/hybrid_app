myAppModule.directive('productionQty', function() {
  return {
    require: 'ngModel',
    link: function (scope, element, attr, ngModelCtrl) {
      function fromUser(text) {
        var transformedInput = text.replace(/[^0-9]/g, '');
        if(transformedInput !== text) {
            ngModelCtrl.$setViewValue(transformedInput);
            ngModelCtrl.$render();
        }
        return transformedInput;
      }
      ngModelCtrl.$parsers.push(fromUser);
    }
  }; 
});

myAppModule.directive('focusOn', function() {
   return function(scope, elem, attr) {
      scope.$on('focusOn', function(e, name) {
        if(name === attr.focusOn) {
          elem[0].focus();
        }
      });
   };
});

myAppModule.factory('focus', function ($rootScope, $timeout) {
  return function(name) {
    $timeout(function (){
      $rootScope.$broadcast('focusOn', name);
    });
  }
});

myAppModule.directive('countdown',function (Util, $interval) 
{
    return {
        restrict: 'A',
        scope: { date: '@'},
        link: function (scope, element) {
            var future;
            future = new Date(scope.date);
            $interval(function () {
                var diff;
                diff = Math.floor((future.getTime() - new Date().getTime()) / 1000);
                return element.text(Util.dhms(diff));
            }, 1000);
        }
    };
});

myAppModule.factory('Util', function () 
{
      return {
          dhms: function (t) {
              var days, hours, minutes, seconds;
              days = Math.floor(t / 86400);
              t -= days * 86400;
              hours = Math.floor(t / 3600) % 24;
              t -= hours * 3600;
              minutes = Math.floor(t / 60) % 60;
              t -= minutes * 60;
              seconds = t % 60;
              return [
                  days + 'd',
                  hours + 'h',
                  minutes + 'm',
                  seconds + 's'
              ].join(' ');
          }
      };
});