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
    	var nomortransaksi  = items.notransk;
        var itempembeliandengannomortransaksi 	= StorageService.get(nomortransaksi);
        var len = itempembeliandengannomortransaksi.length;
        for(var i = len - 1;i >= 0;i--)
        {
            itempembeliandengannomortransaksi[i].ITEM_QTY    = itempembeliandengannomortransaksi[i].quantity;
            itempembeliandengannomortransaksi[i].TRANS_TYPE  = 4;
            TransaksiFac.SetTranskasi(itempembeliandengannomortransaksi[i])
            .then(function(response)
            {
                itempembeliandengannomortransaksi.splice(i,1);
                StorageService.set(nomortransaksi,itempembeliandengannomortransaksi);
                if(itempembeliandengannomortransaksi.length == 0)
                {
                   var index =  _.findIndex($scope.datas, {'notransk': items.notransk});
                   StorageService.destroy(nomortransaksi)
                   $scope.datas.splice(index,1);
                   StorageService.set('bookingtransaksi',$scope.datas);
                }
            },
            function(error)
            {
                console.log(error);
            })
            .finally(function()
            {

            });

            

        }
    }
});
