angular.module('starter')
.controller('StoresCtrl', function($http,$window,$scope,$state,$location,$timeout,$ionicLoading,$ionicHistory,StorageService) 
{
	$http({method:'GET',url:'http://api.lukisongroup.com/logintest/users?username=trial1'})
    .success(function(response) 
    {
        console.log(response);
    },
    function(error,config)
    {
        console.log(config);
    });
    
});