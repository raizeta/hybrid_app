angular.module('starter')
.controller('SummaryCtrl', function($filter,$window,$scope,$state,$location,$timeout,$ionicLoading,$ionicHistory,StorageService,SummaryLiteFac,CloseBookLiteFac,UtilService) 
{
    var tanggalsekarang = $filter('date')(new Date(),'yyyy-MM-dd');
    SummaryLiteFac.CountTransaksiComplete()
    .then(function(response)
    {
        if(angular.isArray(response) && response.length > 0)
        {
            $scope.jlhcomplete = response[0].jlhcomplete;
        }
    });
    SummaryLiteFac.CountTransaksiInComplete()
    .then(function(response)
    {
        if(angular.isArray(response) && response.length > 0)
        {
            $scope.jlhincomplete = response[0].jlhincomplete;
        }
    });

    SummaryLiteFac.JoinTransWithShopCart()
    .then(function(response)
    {
        $scope.totalpendapatan = UtilService.SumPriceWithQty(response,'ITEM_HARGA','QTY_INCART');
    });

    SummaryLiteFac.BayarCash('COMPLETE',tanggalsekarang,$scope.profile.username,'CASH')
    .then(function(response)
    {
        $scope.bayarcash = UtilService.SumJustPriceOrQty(response,'TOTAL_SPENT')
    });
    SummaryLiteFac.BayarCash('COMPLETE',tanggalsekarang,$scope.profile.username,'EDC')
    .then(function(response)
    {
        $scope.bayaredc = UtilService.SumJustPriceOrQty(response,'TOTAL_SPENT');
        console.log($scope.bayaredc);
    });
    SummaryLiteFac.BayarCash('COMPLETE',tanggalsekarang,$scope.profile.username,'ACC')
    .then(function(response)
    {
        $scope.bayaracc = UtilService.SumJustPriceOrQty(response,'TOTAL_SPENT');
        console.log($scope.bayaracc);
    });

    CloseBookLiteFac.GetOpenBookByUsername($scope.profile.username)
    .then(function(responseopenbook)
    {
        console.log(responseopenbook);
        $scope.findindrawer = 0;
        $scope.addedcash    = 0;
        $scope.checkcash    = 0;
        $scope.saldoawal    = 0;
        if(responseopenbook.length > 0)
        {
            $scope.findindrawer += responseopenbook[responseopenbook.length - 1].CASHINDRAWER;
            $scope.addedcash    += responseopenbook[responseopenbook.length - 1].ADDCASH;
            $scope.checkcash    += responseopenbook[responseopenbook.length - 1].CHECKCASH;
            $scope.saldoawal    += $scope.checkcash + $scope.addedcash;
        }
    },
    function(error)
    {
        console.log(error);
    });
    
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
        console.log(response);
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
    	// items.show = !items.show;
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
    ////Lebih Dari Satu Bisa Collapse
    // $scope.toggleGroup = function(items) 
    // {
    //     items.show = !items.show;
    // };
    // $scope.isGroupShown = function(items) 
    // {
    //     console.log(items.show);
    //     return items.show;
    // };

    ////Hanya Satu Item Yang Bisa Collapse
    $scope.toggleGroup = function(group) 
    {
        if ($scope.isGroupShown(group)) 
        {
          $scope.shownGroup = null;
        } 
        else 
        {
          $scope.shownGroup = group;
        }
    };
    $scope.isGroupShown = function(group) 
    {
        return $scope.shownGroup === group;
    };

    $scope.data = {showReorder:false};
})

.controller('SetoranCtrl', function($filter,$ionicLoading,$ionicHistory,$ionicModal,$timeout,$scope,$state,$cordovaCamera,UtilService,CloseBookLiteFac,SummaryLiteFac,TransaksiFac)
{
    CloseBookLiteFac.GetCloseBookByUsername($scope.profile.username)
    .then(function(responseclosebook)
    {
        if (responseclosebook.length > 1)
        {
            if(responseclosebook[responseclosebook.length - 1].NAMA_TYPE == 'CLOSEBOOK')
            {
                $scope.setoran = responseclosebook[responseclosebook.length - 1];
                $scope.gambarbukti = 'img/save-image.png';
            }  
        }
    },
    function(error)
    {
        console.log(error);
    });
    $scope.fotobuktisetoran = function()
    {
        document.addEventListener("deviceready", function () 
        {
            var options = UtilService.CameraOptions();
            $cordovaCamera.getPicture(options)
            .then(function (imageData) 
            {
                $scope.gambarbukti   = 'data:image/jpeg;base64,' + imageData;
            });
        }, false);
    }

    $scope.submitsetoran = function()
    {
        
        var datatoserver    = {};
        datatoserver.CLOSING_ID     = '13.13.13';
        datatoserver.ACCESS_UNIX    = $scope.profile.ACCESS_UNIX;
        datatoserver.STORAN_DATE    = $filter('date')(new Date(),'yyyy-MM-dd');
        datatoserver.OUTLET_ID      = $scope.stores.OUTLET_CODE;
        datatoserver.TTL_STORAN     = $scope.setoran.WITHDRAW;
        datatoserver.IMG            = $scope.gambarbukti;
        console.log(datatoserver);
        TransaksiFac.SetTranskasiClosing(datatoserver)
        .then(function(responsesetoran)
        {
            console.log(responsesetoran)
        },
        function(errorsetoran)
        {
            console.log(errorsetoran);
        });
    }
    
});