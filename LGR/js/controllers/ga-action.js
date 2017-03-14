angular.module('starter')
.controller('GaInventoryCtrl', 
function($scope,$ionicLoading,$filter,$ionicModal,UtilService,StorageService,StoreFac,TransaksiFac) 
{
    $scope.tglsekarang      = $filter('date')(new Date(),'dd-MM-yyyy');
    var kemarin     = new Date();
    kemarin.setDate(kemarin.getDate() - 1);
    // $scope.datas = [];
    StoreFac.GetStores()
    .then(function(response)
    {
    	console.log(response);
    	$scope.stores = response;
    },
    function(error)
    {
    	console.log(error);
    })
    .finally(function()
    {

    });
    $scope.selecttoko = function(item)
    {
    	$scope.tglinv   = $filter('date')(new Date(),'yyyy-MM-dd');
    	TransaksiFac.GetTransaksis(item.OUTLET_BARCODE,$scope.tglinv,1)
        .then(function(response)
        {
            $scope.datas = [];
            angular.forEach(response,function(value,key)
            {
            	value.belanja = value.ITEM_QTY;
            	$scope.datas.push(value);
            })
        },
        function(err)
        {
            console.log(err);
        })
        .finally(function()
        {

        });
    }

    $scope.incdec = function(incordec,items)
    {
   
        if(incordec == 'inc')
        {
            items.belanja += 1;
        }
        else if(incordec == 'dec')
        {
            items.belanja -= 1;
        }
    }

    $scope.submitinventory = function(datafromview)
    {
    	var datas = angular.copy(datafromview);
        angular.forEach(datas,function(value,key)
        {
            value.ITEM_QTY          = value.belanja;
            value.TYPE              = 'BUY';
            value.TRANS_TYPE        = 2;
            value.USER_ID           = $scope.profile.id;
            value.CREATE_BY         = $scope.profile.id;
            value.CREATE_AT         = $filter('date')(new Date(),'yyyy-MM-dd H:m:s');
            
            TransaksiFac.SetTranskasi(value)
            .then(function(response)
            {
                console.log(response)
            },
            function(error)
            {
                console.log(error);
            })
            .finally(function()
            {

            });

        });
    }
});
