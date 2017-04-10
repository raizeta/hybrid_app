angular.module('starter')
.controller('SummaryCtrl', function($window,$scope,$state,$location,$timeout,$ionicLoading,$ionicHistory,StorageService) 
{

    
})

.controller('TransaksiCtrl', 
function($scope,$ionicLoading,$filter,$ionicPopup,$ionicModal,UtilService,StorageService,TransCustLiteFac,ShopCartLiteFac,TransaksiFac) 
{
    $scope.tglsekarang      = $filter('date')(new Date(),'yyyy-MM-dd');
    var barangpenjualan 	= StorageService.get('BrgPenjualan');
    var lokasistore         = StorageService.get('LokasiStore');

    TransCustLiteFac.GetTransCustsByDateStatus($scope.tglsekarang,'COMPLETE')
    .then(function(response)
    {
        $scope.datas = [];
        angular.forEach(response,function(value,key)
        {
            ShopCartLiteFac.GetShopCartByNomorTrans(value.NOMOR_TRANS)
            .then(function(responseshopcart)
            {
                value.subtotal          = UtilService.SumPriceWithQty(responseshopcart,'ITEM_HARGA','QTY_INCART');
                value.datayangdibeli    = responseshopcart;
                $scope.datas.push(value);
            }); 
        });
    });
    
    $scope.synctoserver  	= function(items,$index)
    {
    	items.show = !items.show;
        var confirmPopup = $ionicPopup.confirm(
                                {
                                    title: 'Sync To Server',
                                    template: 'Are you sure to sync this data to Our Server?'
                                });
        confirmPopup.then(function(res) 
        {
            if(res) 
            {
                var nomortransaksi  = items.NOMOR_TRANS;
                $ionicLoading.show
                ({
                  template: 'Loading...'
                })
                .then(function()
                {
                    
                    var itemyangdibeli  = items.datayangdibeli;
                    var len             = items.datayangdibeli.length;
                    for(var i = len - 1;i >= 0;i--)
                    {
                        var datatosave  = {};
                        datatosave.ITEM_QTY    = itemyangdibeli[i].QTY_INCART;
                        datatosave.TRANS_TYPE  = 4;
                        datatosave.ITEM_NM     = itemyangdibeli[i].ITEM_NM;
                        datatosave.ITEM_ID     = itemyangdibeli[i].ITEM_ID;
                        datatosave.CREATE_AT   = $filter('date')(new Date(),'yyyy-MM-dd HH:mm:ss');;
                        datatosave.CREATE_BY   = $scope.profile.id;
                        datatosave.USER_ID     = $scope.profile.id;
                        datatosave.OUTLET_ID   = lokasistore.OUTLET_BARCODE;
                        datatosave.OUTLET_NM   = lokasistore.OUTLET_NM;
                        var lastthree = nomortransaksi.substr(nomortransaksi.length - 3); // => "Tabs1"
                        datatosave.TRANS_ID    = '4.' + lokasistore.OUTLET_BARCODE +'.'+ $filter('date')(new Date(),'yyyy.MM.dd') +'.0000' + (Number(lastthree));
                        datatosave.STATUS      = 1;

                        TransaksiFac.SetTranskasi(datatosave)
                        .then(function(response)
                        {
                            itemyangdibeli.splice(i,1);
                            if(itemyangdibeli.length == 0)
                            {
                               $scope.datas.splice($index,1);
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
    $scope.toggleGroup = function(items) 
    {
        items.show = !items.show;
    };
    $scope.isGroupShown = function(items) 
    {
        return items.show;
    };

    $scope.data = {showReorder:false};
})

.controller('IncomeCtrl', function($window,$scope,$state,$location,$timeout,$ionicLoading,$ionicHistory,StorageService) 
{

    
})

.controller('OutcomeCtrl', function($window,$scope,$state,$location,$timeout,$ionicLoading,$ionicHistory,StorageService) 
{

    
});