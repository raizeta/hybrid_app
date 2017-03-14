angular.module('starter')
.controller('SyncCtrl', 
function($scope,$ionicLoading,$filter,$ionicModal,UtilService,StorageService,TransaksiFac) 
{
    $scope.tglsekarang      = $filter('date')(new Date(),'dd-MM-yyyy');
    $scope.datas            = StorageService.get('bookingtransaksi');
    var barangpenjualan 	= StorageService.get('BrgPenjualan');
    angular.forEach($scope.datas,function(value,key)
    {
        var itembelanja = StorageService.get(value.notransk);
        $scope.datas[key].jumlahitem        = itembelanja.length;
        $scope.datas[key].subtotal          = UtilService.SumPriceWithQty(itembelanja,'harga','quantity')
    })
    $scope.synctoserver  	= function(items)
    {
    	var detailyangdibeliasli 	= StorageService.get(items.notransk);
    	var detailyangdibeli 		= angular.copy(detailyangdibeliasli);
    	angular.forEach(detailyangdibeli,function(value,key)
    	{
    		var indexarrayasli = _.findIndex(barangpenjualan, {'ITEM_NM': value.nama});
    		barangpenjualan[indexarrayasli].ITEM_QTY 	= value.quantity;
    		barangpenjualan[indexarrayasli].TRANS_TYPE 	= 4;
    		TransaksiFac.SetTranskasi(barangpenjualan[indexarrayasli])
            .then(function(response)
            {
                detailyangdibeliasli.splice(key,1);
                StorageService.set(items.notransk,detailyangdibeliasli);
            },
            function(error)
            {
                console.log(error);
            })
            .finally(function()
            {

            });
    	})
    }
});
