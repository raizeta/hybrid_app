angular.module('starter')
.controller('SettingCtrl', function($scope,$state,$ionicLoading,StorageService) 
{
    $scope.settings = {'enablefacebook':true,'enablegoogle':true,'enablelinkedin':false,'enabletwitter':false};
    if(!$scope.profile.picture)
    {
    	$scope.profile.picture = "img/rt.png";
    }
});