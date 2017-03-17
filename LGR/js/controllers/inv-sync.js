angular.module('starter')
.controller('SyncCtrl', 
function($scope,$ionicLoading,$filter,$ionicPopup,$ionicModal,UtilService,StorageService,TransCustLiteFac,TransaksiFac) 
{
    $scope.tglsekarang      = $filter('date')(new Date(),'dd-MM-yyyy');
    var barangpenjualan 	= StorageService.get('BrgPenjualan');
    var lokasistore         = StorageService.get('LokasiStore');

    TransCustLiteFac.GetTransCustsByDateStatus($scope.tglsekarang,'COMPLETE')
    .then(function(response)
    {
        $scope.datas = [];
        angular.forEach(response,function(value,key)
        {
            var itembelanja                     = StorageService.get(value.MOMOR_TRANS);
            if(itembelanja)
            {
                value.jumlahitem        = itembelanja.length;
                value.subtotal          = UtilService.SumPriceWithQty(itembelanja,'harga','quantity');
                $scope.datas.push(value);   
            } 
        });
    });
    
    $scope.synctoserver  	= function(items)
    {
    	var confirmPopup = $ionicPopup.confirm(
                                {
                                    title: 'Sync To Server',
                                    template: 'Are you sure to sync this data to Our Server?'
                                });
        confirmPopup.then(function(res) 
        {
            if(res) 
            {
                var nomortransaksi  = items.MOMOR_TRANS;
                var itempembeliandengannomortransaksi 	= StorageService.get(nomortransaksi);
                var len = itempembeliandengannomortransaksi.length;
                $ionicLoading.show
                ({
                  template: 'Loading...'
                })
                .then(function()
                {
                    for(var i = len - 1;i >= 0;i--)
                    {
                        itempembeliandengannomortransaksi[i].ITEM_QTY    = itempembeliandengannomortransaksi[i].quantity;
                        itempembeliandengannomortransaksi[i].TRANS_TYPE  = 4;
                        itempembeliandengannomortransaksi[i].ITEM_NM     = itempembeliandengannomortransaksi[i].nama;
                        itempembeliandengannomortransaksi[i].ITEM_ID     = itempembeliandengannomortransaksi[i].ITEM_ID;
                        itempembeliandengannomortransaksi[i].CREATE_AT   = $filter('date')(new Date(),'yyyy-MM-dd HH:mm:ss');;
                        itempembeliandengannomortransaksi[i].CREATE_BY   = $scope.profile.id;
                        itempembeliandengannomortransaksi[i].USER_ID     = $scope.profile.id;
                        itempembeliandengannomortransaksi[i].OUTLET_ID   = lokasistore.OUTLET_BARCODE;
                        itempembeliandengannomortransaksi[i].OUTLET_NM   = lokasistore.OUTLET_NM;
                        var lastthree = nomortransaksi.substr(nomortransaksi.length - 3); // => "Tabs1"
                        itempembeliandengannomortransaksi[i].TRANS_ID    = '4.' + lokasistore.OUTLET_BARCODE +'.'+ $filter('date')(new Date(),'yyyy.MM.dd') +'.0000' + (Number(lastthree));
                        itempembeliandengannomortransaksi[i].STATUS      = 1;
                        TransaksiFac.SetTranskasi(itempembeliandengannomortransaksi[i])
                        .then(function(response)
                        {
                            itempembeliandengannomortransaksi.splice(i,1);
                            StorageService.set(nomortransaksi,itempembeliandengannomortransaksi);
                            if(itempembeliandengannomortransaksi.length == 0)
                            {
                               var index =  _.findIndex($scope.datas, {'MOMOR_TRANS': items.MOMOR_TRANS});
                               StorageService.destroy(nomortransaksi)
                               $scope.datas.splice(index,1);
                               $ionicLoading.show({template: 'Loading...',duration: 500});
                               alert("Sync Data Ke Server Berhasil Dilakukan.Terima Kasih")
                            }
                        },
                        function(error)
                        {
                            console.log(error);
                            $ionicLoading.show({template: 'Loading...',duration: 500});
                        })
                        .finally(function()
                        {
                           
                        });
                    }

                });
            }
        });
    }
});
