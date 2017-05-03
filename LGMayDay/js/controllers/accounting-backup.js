angular.module('starter')
.controller('SummaryCtrl', function($filter,$window,$scope,$state,$location,$timeout,$ionicLoading,$ionicHistory,StorageService,SummaryLiteFac,CloseBookLiteFac,UtilService) 
{
    var tanggalsekarang = $filter('date')(new Date(),'yyyy-MM-dd');
    var STATUS_BUY      = 'COMPLETE';
    var TRANS_DATE      = tanggalsekarang;
    var ACCESS_UNIX     = $scope.profile.ACCESS_UNIX;
    var OUTLET_ID       = $scope.stores.OUTLET_CODE;
    SummaryLiteFac.CountTransaksiComplete(STATUS_BUY,TRANS_DATE)
    .then(function(response)
    {
        if(angular.isArray(response) && response.length > 0)
        {
            $scope.jlhcomplete = response[0].jlhcomplete;
        }
    });

    SummaryLiteFac.JoinTransWithShopCart(STATUS_BUY)
    .then(function(response)
    {
        $scope.totalpendapatan = UtilService.SumPriceWithQty(response,'ITEM_HARGA','QTY_INCART');
    },
    function(error)
    {
        console.log(error);
    });

    SummaryLiteFac.BayarCash(STATUS_BUY,TRANS_DATE,ACCESS_UNIX,TYPE_PAY = 0,OUTLET_ID)
    .then(function(response)
    {
        $scope.bayarcash = UtilService.SumJustPriceOrQty(response,'TOTAL_HARGA')
    });
    SummaryLiteFac.BayarCash(STATUS_BUY,TRANS_DATE,ACCESS_UNIX,TYPE_PAY = 1,OUTLET_ID)
    .then(function(response)
    {
        $scope.bayaredc = UtilService.SumJustPriceOrQty(response,'TOTAL_HARGA');
    });
    SummaryLiteFac.BayarCash(STATUS_BUY,TRANS_DATE,ACCESS_UNIX,TYPE_PAY = 2,OUTLET_ID)
    .then(function(response)
    {
        $scope.bayaracc = UtilService.SumJustPriceOrQty(response,'TOTAL_HARGA');
    });

    CloseBookLiteFac.GetOpenCloseBook(TRANS_DATE,ACCESS_UNIX,OUTLET_ID,'OPENBOOK')
    .then(function(responseopenbook)
    {
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
    });  
})

.controller('TransaksiCtrl', 
function($scope,$ionicLoading,$filter,$ionicPopup,$ionicModal,UtilService,StorageService,TransCustLiteFac,ShopCartLiteFac,TransaksiFac) 
{
    var tanggalsekarang = $filter('date')(new Date(),'yyyy-MM-dd');
    var TRANS_DATE      = tanggalsekarang;
    var ACCESS_UNIX     = $scope.profile.ACCESS_UNIX;
    var OUTLET_ID       = $scope.stores.OUTLET_CODE;
    var STATUS_BUY      = 'COMPLETE';

    TransCustLiteFac.GetTransCustsHeaderWithStatus(TRANS_DATE,ACCESS_UNIX,OUTLET_ID,STATUS_BUY)
    .then(function(response)
    {
        $scope.total = 0;
        $scope.datas = [];
        angular.forEach(response,function(value,key)
        {
            var splittransid    = value.TRANS_ID.split('.');
            value.SPLIT         = splittransid[2];
            $scope.total       += value.TOTAL_HARGA;
            if(value.TYPE_PAY == 0)
            {
                value.TYPE_PAY = 'CASH';
            }
            else if(value.TYPE_PAY = 1)
            {
                value.TYPE_PAY = 'EDC';
            }
            else
            {
                value.TYPE_PAY = 'ACC';
            }
            $scope.datas.push(value); 
        });
        $scope.showdetail($scope.datas[0]);
    });
    $scope.showdetail   = function(item)
    {
        if ($scope.isGroupShown(item)) 
        {
          // $scope.shownGroup = null;
        } 
        else 
        {
          $scope.shownGroup = item;
        }

        $ionicLoading.show
        ({
          template: '<ion-spinner icon="spiral" class="spinner-energized"></ion-spinner>',
          noBackdrop:true
        })
        .then(function()
        {
            if(item.BANK_NM == 'null')
            {
                item.BANK_NM = '';
            }
            $scope.headerdetail = angular.copy(item);
            ShopCartLiteFac.GetShopCartByNomorTrans(item.TRANS_ID)
            .then(function(responseshopcart)
            {
                $scope.datayangdibeli    = responseshopcart;
            });
        })
        .finally(function()
        {
            $ionicLoading.show({template: '<ion-spinner icon="spiral" class="spinner-energized"></ion-spinner>',duration: 100});
        });
    }
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
                    
                    var itemyangdibeli  = angular.copy(items.datayangdibeli);
                    var len             = itemyangdibeli.length;
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
                        datatosave.OUTLET_ID   = $scope.stores.OUTLET_CODE;
                        datatosave.OUTLET_NM   = $scope.stores.OUTLET_NM;
                        var lastthree          = nomortransaksi.substr(nomortransaksi.length - 3); // => "Tabs1"
                        datatosave.TRANS_ID    = $scope.profile.ACCESS_UNIX + '.' + $scope.stores.OUTLET_CODE + '.' + $filter('date')(new Date(),'yyyyMMdd') + (Number(lastthree));
                        datatosave.STATUS      = 1;

                        TransaksiFac.SetTranskasi(datatosave)
                        .then(function(response)
                        {
                            var datatosavedetailisonserver = {};
                            datatosavedetailisonserver.NOMOR_TRANS  = nomortransaksi;
                            datatosavedetailisonserver.ITEM_ID      = response.ITEM_ID;
                            ShopCartLiteFac.UpdateIsOnServer(datatosavedetailisonserver)
                            .then(function(responseupdatestatusisonserver)
                            {
                                console.log("Update Status Detail Ke Local Sukses");
                            },
                            function(errorupdatestatusinonserver)
                            {
                                console.log("Update Status Detail Ke Local Gagal");
                            });

                            itemyangdibeli.splice(i,1);
                            if(itemyangdibeli.length == 0)
                            {
                               $scope.datas[$index].IS_ONSERVER = 1;
                               TransCustLiteFac.UpdateIsOnServer(nomortransaksi)
                                .then(function(responseheaderinonserver)
                                {
                                    console.log("Sukses Update Status Is On Server Di Local");
                                },
                                function(errorupdateisonserver)
                                {
                                    console.log("Gagal Update Is On Server Di Local");
                                });
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
    $scope.isGroupShown = function(datatoshow) 
    {
        return $scope.shownGroup === datatoshow;
    };
})

.controller('SetoranCtrl', function($filter,$ionicLoading,$ionicHistory,$ionicModal,$timeout,$scope,$state,$cordovaCamera,UtilService,CloseBookLiteFac,SummaryLiteFac,TransaksiFac,ConstructorService)
{
    var tglsekarang         = $filter('date')(new Date(),'yyyy-MM-dd');
    var STATUS              = 0;
    var IS_ONSERVER         = 0;
    CloseBookLiteFac.GetSetoranBook(tglsekarang,$scope.profile.ACCESS_UNIX,$scope.stores.OUTLET_CODE,STATUS,IS_ONSERVER)
    .then(function(responsesetoranbook)
    {
        if (responsesetoranbook.length > 0)
        {
            $scope.setoran = responsesetoranbook[responsesetoranbook.length - 1];  
        }
        else
        {
            alert("Kamu Belum Melakukan Closing.Lakukan Closing Terlebih Dahulu");
            $scope.setoran  = ConstructorService.SetoranConstructor();
            $scope.disablesubmit    = true;
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
                $scope.setoran.IMG   = 'data:image/jpeg;base64,' + imageData;
            });
        }, false);
    }

    $scope.submitsetoran = function()
    {
        
        $ionicLoading.show
        ({
          template: 'Loading...'
        })
        .then(function()
        {
            $scope.setoran.OUTLET_ID    = $scope.setoran.OUTLET_CODE;
            $scope.setoran.STATUS       = 1;
            TransaksiFac.SetTranskasiClosing($scope.setoran)
            .then(function(responsesetoran)
            {
                alert("Bukti Setoran Telah Berhasil Diupload Ke Server");
                $scope.disablesubmit    = true;
            },
            function(errorsetoran)
            {
                console.log(errorsetoran);
            })
            .finally(function()
            {
                $ionicLoading.show({template: 'Loading...',duration: 500});
            });

            CloseBookLiteFac.UpdateStatusSetoranBook($scope.setoran)
            .then(function(responseupdatestatus)
            {
                console.log(responseupdatestatus)
            },
            function(errorupdatestatus)
            {
                console.log(errorupdatestatus);
            })
        });
    }
});