angular.module('starter')
.controller('SettingCtrl', function($scope,$state,$ionicLoading,StorageService) 
{
    $scope.settings = {'enablefacebook':true,'enablegoogle':true,'enablelinkedin':false,'enabletwitter':false};
    $scope.profiles = StorageService.get('profile');
});