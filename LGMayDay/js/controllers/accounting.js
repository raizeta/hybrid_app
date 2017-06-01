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
function($scope,$ionicLoading,$filter,$ionicPopup,$ionicModal,UtilService,StorageService,TransaksiCombFac,TransCustLiteFac,ShopCartLiteFac,TransaksiFac,TransaksiHeaderFac,TransaksiDetailFac) 
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
        $scope.dataoffline  = [];
        $scope.dataonline   = [];
        if(angular.isArray(response) && response.length > 0)
        {
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
                if(value.IS_ONSERVER)
                {
                    $scope.dataonline.push(value);
                }
                else
                {
                    $scope.dataoffline.push(value);
                }
                $scope.datas.push(value); 
            });
            $scope.showdetail($scope.datas[0]);
        }
    });
    $scope.showdetail   = function(item)
    {
        if (!$scope.isGroupShown(item)) 
        {
            $scope.shownGroup = item;
            $ionicLoading.show
            ({
              template: '<ion-spinner icon="spiral" class="spinner-energized"></ion-spinner>',
              noBackdrop:false
            })
            .then(function()
            {
                if(item.BANK_NM == 'null')
                {
                    item.BANK_NM = '';
                }
                $scope.headerdetail = angular.copy(item);
                TransaksiCombFac.GetTransaksiDetail(item.TRANS_ID,$scope.profile.access_token)
                .then(function(responseshopcart)
                {
                    $scope.datayangdibeli    = responseshopcart;
                    $scope.synctoserver(item,$scope.datayangdibeli)
                });
            })
            .finally(function()
            {
                $ionicLoading.show({template: '<ion-spinner icon="spiral" class="spinner-energized"></ion-spinner>',duration: 1000});
            });
        } 
         
    }
    $scope.synctoserver  	= function(header,detail)
    {
        if(!header.IS_ONSERVER)
        {
            var itemyangdibeli  = angular.copy(detail);
            var itemblmsinkron  = [];
            angular.forEach(itemyangdibeli,function(value,key)
            {
                if(!value.IS_ONSERVER)
                {
                    itemblmsinkron.push(value);
                }
            });
            var len   = itemblmsinkron.length;
            for(var i = len - 1;i >= 0;i--)
            {
                var datadetailsaveserver    = {};
                datadetailsaveserver.TRANS_ID           = header.TRANS_ID;
                datadetailsaveserver.ACCESS_UNIX        = header.ACCESS_UNIX;
                datadetailsaveserver.TRANS_DATE         = header.TRANS_DATE;
                datadetailsaveserver.OUTLET_ID          = header.OUTLET_ID;
                datadetailsaveserver.OUTLET_NM          = $scope.stores.OUTLET_NM;
                datadetailsaveserver.ITEM_ID            = itemblmsinkron[i].ITEM_ID;   
                datadetailsaveserver.ITEM_NM            = itemblmsinkron[i].ITEM_NM;
                datadetailsaveserver.ITEM_QTY           = itemblmsinkron[i].QTY_INCART;
                datadetailsaveserver.HARGA              = itemblmsinkron[i].ITEM_HARGA;
                datadetailsaveserver.DISCOUNT           = itemblmsinkron[i].DISCOUNT;
                datadetailsaveserver.SATUAN             = itemblmsinkron[i].SATUAN;
                datadetailsaveserver.DISCOUNT_STT       = 1;
                datadetailsaveserver.STATUS             = 1;
                datadetailsaveserver.CREATE_AT          = itemblmsinkron[i].DATETIME_ADDTOCART;
                datadetailsaveserver.CREATE_BY          = header.ACCESS_UNIX;
                datadetailsaveserver.UPDATE_AT          = itemblmsinkron[i].DATETIME_ADDTOCART;
                datadetailsaveserver.UPDATE_BY          = header.ACCESS_UNIX;
                TransaksiDetailFac.SetTranskasiDetail(datadetailsaveserver)
                .then(function(responsesavedetail)
                {
                    var datatosavedetailisonserver = {};
                    datatosavedetailisonserver.NOMOR_TRANS  = header.TRANS_ID;
                    datatosavedetailisonserver.ITEM_ID      = responsesavedetail.ITEM_ID;
                    ShopCartLiteFac.UpdateIsOnServer(datatosavedetailisonserver)
                    .then(function(responseupdatestatusisonserver)
                    {
                        console.log("Update Status Detail Ke Local Sukses");
                    },
                    function(errorupdatestatusinonserver)
                    {
                        console.log("Update Status Detail Ke Local Gagal");
                    });
                    itemblmsinkron.splice(i,1);
                    if(itemblmsinkron.length == 0)
                    {                                    
                        header.STATUS             = 1;
                        TransaksiHeaderFac.SetTranskasiHeader(header)
                        .then(function(responsetransaksiheaderfromserver)
                        {
                            TransCustLiteFac.UpdateTransCustHeaderIsOnServer(header.TRANS_ID,responsetransaksiheaderfromserver.ID)
                            .then(function(responseupdateheaderinonserver)
                            {
                                console.log("Sukses Update Status Is On Server Di Local");
                                header.IS_ONSERVER = 1;
                            },
                            function(errorupdateheaderinonserver)
                            {
                                console.log("Gagal Update Is On Server Di Local");
                            });
                        },
                        function(errorserver)
                        {
                            console.log("Gagal Menyimpan Header Ke Server");
                        });
                    }
                },
                function(errorsavedetail)
                {
                    console.log("Gagal Menyimpan Detail Ke Server");
                }); 
            }
        }
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
    .then(function(responsesetoranbookonlocal)
    {
        if (responsesetoranbookonlocal.length > 0)
        {
            $scope.setoranlocal = responsesetoranbookonlocal;
            $scope.showdetail($scope.setoranlocal[0])  
        }
    });
    CloseBookLiteFac.GetSetoranBook(tglsekarang,$scope.profile.ACCESS_UNIX,$scope.stores.OUTLET_CODE,STATUS = 1 ,IS_ONSERVER = 1)
    .then(function(responsesetoranbookonserver)
    {
        if (responsesetoranbookonserver.length > 0)
        {
            $scope.setoranserver = responsesetoranbookonserver;  
        }
    });

    $scope.showdetail   = function(item)
    {
        if (!$scope.isGroupShown(item)) 
        {
            $scope.shownGroup = item;
            $ionicLoading.show
            ({
                template: '<ion-spinner icon="spiral" class="spinner-energized"></ion-spinner>',
                noBackdrop:true
            })
            .then(function()
            {
                $scope.setoran = item;  
            })
            .finally(function()
            {
                $ionicLoading.show({template: '<ion-spinner icon="spiral" class="spinner-energized"></ion-spinner>',duration: 100});
            });
        }
    }
    $scope.isGroupShown = function(datatoshow) 
    {
        return $scope.shownGroup === datatoshow;
    };
    $scope.fotobuktisetoran = function()
    {
        if(!$scope.setoran.IS_ONSERVER)
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
            $scope.setoran.OUTLET_ID    = $scope.setoran.OUTLET_CODE;
            $scope.setoran.STATUS       = 1;

            $ionicLoading.show
            ({
              template: '<ion-spinner icon="spiral" class="spinner-energized"></ion-spinner>',
              noBackdrop:true
            })
            .then(function()
            {
                TransaksiFac.SetTranskasiClosing($scope.setoran)
                .then(function(responsesetoran)
                {
                    alert("Bukti Setoran Telah Berhasil Diupload Ke Server");
                    $scope.disablesubmit    = true;
                    var index   = _.findIndex($scope.setoranlocal,{id:$scope.setoran.id});
                    $scope.setoranlocal.splice(index,1);
                    $scope.setoranserver.push($scope.setoran);
                },
                function(errorsetoran)
                {
                    console.log(errorsetoran);
                })
                .finally(function()
                {
                    $ionicLoading.hide();
                });

                CloseBookLiteFac.UpdateStatusSetoranBook($scope.setoran)
                .then(function(responseupdatestatus)
                {
                    console.log(responseupdatestatus)
                },
                function(errorupdatestatus)
                {
                    console.log(errorupdatestatus);
                });
            });
        }
        else
        {
            $scope.showModal('templates/accounting/modalimage.html');
        }
    }

    $scope.showModal = function(templateUrl) 
    {
        $ionicModal.fromTemplateUrl(templateUrl, 
        {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function(modal) 
        {
            $scope.modalimage = modal;
            $scope.modalimage.show();
        });
    }
 
    $scope.closeModal = function() 
    {
        $scope.modalimage.hide();
        $scope.modalimage.remove()
    };
});