angular.module('starter')
.controller('CashierCtrl', function($scope,$filter,$state,$ionicLoading,$ionicPopup,$ionicModal,UtilService,StorageService,InvCheckLiteFac,TransCustLiteFac) 
{
    $scope.profile      = StorageService.get('profile');
    $scope.lokasistore  = StorageService.get('LokasiStore');
    var tglsekarang = $filter('date')(new Date(),'yyyy-MM-dd');

    TransCustLiteFac.GetTransCustsByDateStatus(tglsekarang,'INCOMPLETE')
    .then(function(response)
    {
        $scope.transaks = response;
    },
    function(error)
    {
        console.log(error);
    });

    $scope.gotoitem = function(item)
    {
        StorageService.set('TRANS-ACTIVE',item.NOMOR_TRANS);
        $state.go('tab.sales');
    }
    
    $scope.tambahtransaksi = function()
    {   
        InvCheckLiteFac.GetInvChecks(tglsekarang,'RECEIVED')
        .then(function(response)
        {
            if(angular.isArray(response) && response.length > 0)
            {
                TransCustLiteFac.GetTransCustsByDate(tglsekarang)
                .then(function(responselite)
                {
                    var datacustrans = {};
                    datacustrans.TGL_TRANS          = $filter('date')(new Date(),'yyyy-MM-dd');
                    datacustrans.DATETIME_TRANS     = $filter('date')(new Date(),'yyyy-MM-dd HH:mm:ss');
                    datacustrans.STATUS_BUY         = 'INCOMPLETE';
                    if(responselite.length > 0)
                    {
                        var lastbookingserialnumber     = responselite[responselite.length - 1].NOMOR_TRANS;
                        var lastthree                   = lastbookingserialnumber.substr(lastbookingserialnumber.length - 3);
                        var nomorurut                   = UtilService.StringPad(Number(lastthree) + 1,'000');
                        datacustrans.NOMOR_TRANS        = 'LG.RS.KB.' + $filter('date')(new Date(),'yyyy.MM.dd') + '.' + nomorurut; 
                    }
                    else
                    {
                        datacustrans.NOMOR_TRANS        = 'LG.SR.KB.' + $filter('date')(new Date(),'yyyy.MM.dd') + '.001';
                    }

                    TransCustLiteFac.SetTransCusts(datacustrans)
                    .then(function(response)
                    {
                        $scope.transaks.push(datacustrans);
                    },
                    function(error)
                    {
                        console.log(error);
                    });
                });
            }
            else
            {
                alert("Anda Belum Melakukan Inventory Penjualan.Silahkan Lakukan Inventory Terlebih Dahulu!");  
            }
        });
    }
})

.controller('CartCtrl', function($scope,$state,$filter,$ionicLoading,$ionicPopup,$ionicModal,$ionicHistory,$ionicNavBarDelegate,ShopCartLiteFac,BarangForSaleLiteFac,TransCustLiteFac,UtilService,StorageService) 
{
    $scope.noresi   = StorageService.get('TRANS-ACTIVE');
    ShopCartLiteFac.GetShopCartByNomorTrans($scope.noresi)
    .then(function(response)
    {
        if(angular.isArray(response) && response.length > 0)
        {
            $scope.datas = response;
            $scope.total = UtilService.SumPriceWithQty($scope.datas,'ITEM_HARGA','QTY_INCART');
        }

    });
    BarangForSaleLiteFac.GetBarangForSaleByDate($filter('date')(new Date(),'yyyy-MM-dd'))
    .then(function(response)
    {
        if(angular.isArray(response) && response.length > 0)
        {
            angular.forEach(response,function(value,key)
            {
                var itemaddtocart = _.findIndex($scope.datas, {'ITEM_ID': value.ITEM_ID});
                if(itemaddtocart != -1)
                {
                    $scope.datas[itemaddtocart].STOCK_MAX = Number(value.STOCK_MAX);
                }
            });
        }
    });
    
    $scope.incdec = function(incdec,item)
    {
        if(incdec == 'inc')
        {
            if(item.STOCK_MAX == 0)
            {
                alert("Barang Hanya Tersedia: " + item.QTY_INCART + " Item");
            }
            else
            {
                item.QTY_INCART +=1;
                item.STOCK_MAX -=1;
                item.TGL_SAVE   = $filter('date')(new Date(),'yyyy-MM-dd');

                ShopCartLiteFac.UpdateShopCartQty(item)
                .then(function(response)
                {
                    console.log(response);
                });

                BarangForSaleLiteFac.UpdateBarangForSaleByDateAndItem(item)
                .then(function(response)
                {
                    console.log(response);
                },
                function(error)
                {
                    console.log(error);
                });
            }
        }
        else if(incdec == 'dec')
        {
            if(item.QTY_INCART != 0)
            {
                item.QTY_INCART -=1;
                item.STOCK_MAX  +=1;
                item.TGL_SAVE    = $filter('date')(new Date(),'yyyy-MM-dd');
                
                ShopCartLiteFac.UpdateShopCartQty(item)
                .then(function(response)
                {
                    console.log(response);
                });

                BarangForSaleLiteFac.UpdateBarangForSaleByDateAndItem(item)
                .then(function(response)
                {
                    console.log(response);
                },
                function(error)
                {
                    console.log(error);
                });
            }

        }
        $scope.total = UtilService.SumPriceWithQty($scope.datas,'ITEM_HARGA','QTY_INCART');
    }

    $scope.deleteone = function(item)
    {
        BarangForSaleLiteFac.GetBarangForSaleByDateAndItemID($filter('date')(new Date(),'yyyy-MM-dd'),item.ITEM_ID)
        .then(function(response)
        {
            var datatosave = {};
            datatosave.STOCK_MAX    = response.STOCK_MAX + item.QTY_INCART;
            datatosave.TGL_SAVE     = response.TGL_SAVE;
            datatosave.ITEM_ID      = response.ITEM_ID;
            datatosave.NOMOR_TRANS  = $scope.noresi;
            BarangForSaleLiteFac.UpdateBarangForSaleByDateAndItem(datatosave) 
            .then(function(response)
            {
                ShopCartLiteFac.DeleteShopCartByNoTransAndItemId(datatosave)
                .then(function(response)
                {
                    var itemaddtocart = _.findIndex($scope.datas, {'ITEM_ID': item.ITEM_ID});
                    $scope.datas.splice(itemaddtocart,1);
                    $scope.total = UtilService.SumPriceWithQty($scope.datas,'ITEM_HARGA','QTY_INCART');
                });

            }); 
        });
        
    }

    $scope.pembayaran = function(noresi)
    {
        if($scope.expression >= $scope.total)
        {
            var confirmPopup = $ionicPopup.confirm(
                                    {
                                        title: 'Pembayaran',
                                        template: 'Are you sure to pay this cart?'
                                    });
            confirmPopup.then(function(res) 
            {
                if(res) 
                {
                    TransCustLiteFac.UpdateTransCusts(['COMPLETE',$scope.noresi])
                    .then(function(response)
                    {
                        StorageService.destroy('TRANS-ACTIVE');
                        $ionicHistory.nextViewOptions({disableAnimate: true, disableBack: true});
                        $state.go('tab.cashier');
                    },
                    function(error)
                    {
                        console.log(error);
                    });

                } 
            });
        }
        else
        {
            alert("Uang Yang Disetor Belum Mencukupi Untuk Melakukan Pembayaran");
        }
    }

    $scope.expression = 0;
    $scope.add = function(value) 
    {
        $scope.audio = new Audio('img/beep-07.wav');
        $scope.audio.play();
        if($scope.expression === "" || $scope.expression === undefined) 
        {
            $scope.expression = value;
        } 
        else 
        {
            $scope.expression = $scope.expression + "" + value;
        }
        var xxx = angular.copy($scope.expression);
        $scope.expression = xxx;
    }

    $scope.delangka = function(stringval)
    {
        $scope.audio = new Audio('img/beep-5.wav');
        $scope.audio.play();
        var newStr = stringval.substring(0, stringval.length-1);
        $scope.expression = newStr;
    }
});
