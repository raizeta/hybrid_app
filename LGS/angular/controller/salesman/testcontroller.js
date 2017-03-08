'use strict';
myAppModule.controller("SalesAktifitasTestController", ["$q","$rootScope","$scope", "$location","$http","$window","$filter","auth","SalesAktifitas","resolvesot2type","resolveobjectbarangsqlite", 
function ($q,$rootScope,$scope, $location, $http,$window,$filter,auth,SalesAktifitas,resolvesot2type,resolveobjectbarangsqlite) 
{   
    $scope.loading  = true;
    $scope.userInfo = auth;
	$scope.logout = function () 
    { 
        $scope.userInfo = null;
        $window.sessionStorage.clear();
        window.location.href = "index.html";
    }

    var tanggalplan = $filter('date')(new Date(),'yyyy-MM-dd');
    SalesAktifitas.getSalesAktifitas('CUS.2016.000402',tanggalplan,resolveobjectbarangsqlite,resolvesot2type)
    .then (function(response)
    {
        $scope.salesaktivitas = response;
        console.log($scope.salesaktivitas);
    },
    function (error)
    {
        alert("Sales Aktifitas Error");
    });
    
}]);





