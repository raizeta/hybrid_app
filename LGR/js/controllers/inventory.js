angular.module('starter')
.controller('InventoryCtrl', function($scope,$ionicLoading,$filter,$ionicModal,UtilService,StorageService,ProductFac) 
{
	$scope.tglsekarang = $filter('date')(new Date(),'dd-MM-yyyy');
	ProductFac.GetProducts()
    .then(function(response)
    {
        console.log(response);
        $scope.datas = response;
    },
    function(err)
    {
        console.log(err);
    })
    .finally(function()
    {

    });
})

.controller('BookingCtrl', function($scope,$ionicLoading,$filter,$ionicModal,UtilService,StorageService,ProductFac) 
{
    $scope.tglsekarang = $filter('date')(new Date(),'dd-MM-yyyy');
    ProductFac.GetProducts()
    .then(function(response)
    {
        console.log(response);
        $scope.datas = response;
    },
    function(err)
    {
        console.log(err);
    })
    .finally(function()
    {

    });
});
