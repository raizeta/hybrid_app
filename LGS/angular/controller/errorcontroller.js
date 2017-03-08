'use strict';
myAppModule.controller("Error404Controller", ["$scope", "$location","$http","$window", function ($scope, $location, $http,$window) 
{
    $scope.logout = function () 
    { 
        $scope.userInfo = null;
        $window.sessionStorage.clear();
        window.location.href = "index.html";
    }
}]);

myAppModule.controller("Error500Controller", ["$scope", "$location","$http","$window", function ($scope, $location, $http,$window) 
{
    $scope.logout = function () 
    { 
        $scope.userInfo = null;
        $window.sessionStorage.clear();
        window.location.href = "index.html";
    }
}]);



