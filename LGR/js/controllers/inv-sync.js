angular.module('starter')
.controller('SyncCtrl', 
function($scope,$ionicLoading,$filter,$ionicModal,UtilService,StorageService,TransaksiFac) 
{
    $scope.tglsekarang      = $filter('date')(new Date(),'dd-MM-yyyy');
    $scope.datas            = StorageService.get('bookingtransaksi');
});
