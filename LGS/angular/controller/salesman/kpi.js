'use strict';
myAppModule.controller("KPIController",
function ($rootScope,$scope,$location,auth,$window,$filter,KPIFac) 
{   
    $scope.activekpi    = "active";
    $scope.userInfo     = auth;

    $scope.logout = function () 
    { 
        $scope.userInfo = null;
        $window.sessionStorage.clear();
        $window.location.href = "index.html";
    }
    

    $scope.example = {value: new Date()};
    $scope.onSearchChange = function()
    {
        $scope.loadingcontent = true;
        var tanggalplan = $filter('date')($scope.example.value,'yyyy-MM-dd');
	    KPIFac.GetKPI(tanggalplan,auth.id)
	    .then(function (response)
	    {
	    	$scope.results = response;
	    },
	    function(error)
	    {
	    	alert("Gagal Mendapatkan Data Dari Server");
	    })
	    .finally(function()
    	{
    		$scope.loadingcontent = false;
    	});
    }
    $scope.onSearchChange();

});




