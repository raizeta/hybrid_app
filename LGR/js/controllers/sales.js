angular.module('starter')
.controller('CashierCtrl', function($scope,$filter,$state,$ionicLoading,$ionicPopup,$ionicModal,UtilService,StorageService,InvCheckLiteFac,TransCustLiteFac) 
{
    $scope.profile      = StorageService.get('profile');
    $scope.lokasistore  = StorageService.get('LokasiStore');
    if($scope.profile.gambar == 'none')
    {
        $scope.profile.gambar = "img/customer.jpg";
    }
    else
    {
        $scope.profile.gambar = "data:image/png;base64," + $scope.profile.gambar;
    }
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

.controller('SalesCtrl', function($scope,$state,$ionicLoading,$ionicPopup,$ionicModal,$filter,UtilService,StorageService,BarangForSaleLiteFac,ShopCartLiteFac) 
{
    
    $scope.noresi   = StorageService.get('TRANS-ACTIVE');
    ShopCartLiteFac.GetShopCartByNomorTrans($scope.noresi)
    .then(function(response)
    {
        if(angular.isArray(response) && response.length > 0)
        {
            $scope.itemincart = response;
        }
        else
        {
            $scope.itemincart = [];
        }
        $scope.banyakdicart = $scope.itemincart.length;
    });

    BarangForSaleLiteFac.GetBarangForSaleByDate($filter('date')(new Date(),'yyyy-MM-dd'))
    .then(function(response)
    {
        if(angular.isArray(response) && response.length > 0)
        {
            angular.forEach($scope.itemincart,function(value,key)
            {
                var itemaddtocart = _.findIndex(response, {'ITEM_ID': value.ITEM_ID});
                if(itemaddtocart != -1)
                {
                    response[itemaddtocart].QTY_INCART = Number(value.QTY_INCART);
                }
            });
            $scope.datas = UtilService.ArrayChunk(response,3);
        }
        else
        {
            $scope.datas = [];
        }
    });
    $scope.datastores = [{'OUTLET_NM':'Makananan'},{'OUTLET_NM':'Minuman'},{'OUTLET_NM':'Snack'}]
    $scope.AddToCart = function(item) 
    {
        $scope.itemasli     = angular.copy(item);
        $scope.itemdecinc   = angular.copy(item);
        $ionicModal.fromTemplateUrl('templates/sales/addtocartmodal.html', 
        {
            scope: $scope,
            animation: 'fade-in-scale',
            backdropClickToClose: false,
            hardwareBackButtonClose: false
        })
        .then(function(modal) 
        {
            $ionicLoading.show({template: 'Loading...',duration: 500});
            $scope.modal            = modal;
            $scope.modal.show();
            if(!angular.isDefined(item.QTY_INCART))
            {
                item.QTY_INCART = 0;
            }
            $scope.item = item;
        });  
    };

    $scope.closeModal = function() 
    {
        ShopCartLiteFac.GetShopCartByItemAndNoTrans($scope.item.ITEM_ID,$scope.noresi)
        .then(function(response)
        {
            var datatosave              = {};
            datatosave.NOMOR_TRANS      = $scope.noresi;
            datatosave.ITEM_ID          = $scope.item.ITEM_ID;
            datatosave.ITEM_NM          = $scope.item.ITEM_NM;
            datatosave.ITEM_HARGA       = $scope.item.ITEM_HARGA;
            datatosave.QTY_INCART       = $scope.item.QTY_INCART;
            datatosave.DISCOUNT         = 10;

            if(angular.isArray(response) && response.length > 0)
            {
                if($scope.item.QTY_INCART > 0)
                {
                    ShopCartLiteFac.UpdateShopCartQty(datatosave)
                    .then(function(response)
                    {
                        if($scope.item.QTY_INCART > $scope.itemasli.QTY_INCART)
                        {
                            var selisih = Number($scope.item.QTY_INCART) - Number($scope.itemasli.QTY_INCART);
                            $scope.item.STOCK_MAX -= selisih;
                        }
                        else
                        {
                            var selisih = Number($scope.itemasli.QTY_INCART) - Number($scope.item.QTY_INCART);
                            $scope.item.STOCK_MAX += selisih; 
                        }
                        BarangForSaleLiteFac.UpdateBarangForSaleByDateAndItem($scope.item)
                        .then(function(response)
                        {
                            console.log(response);
                        });
                    });  
                }
                else
                {
                    ShopCartLiteFac.DeleteShopCartByNoTransAndItemId(datatosave)
                    .then(function(response)
                    {
                        $scope.banyakdicart     -= 1;
                        $scope.item.STOCK_MAX    = $scope.itemasli.QTY_INCART + $scope.itemasli.STOCK_MAX;
                        BarangForSaleLiteFac.UpdateBarangForSaleByDateAndItem($scope.item)
                        .then(function(response)
                        {
                            console.log(response);
                        });
                    }); 
                }
                
            }
            else
            {
                if($scope.item.QTY_INCART > 0)
                {
                    ShopCartLiteFac.SetShopCart(datatosave)
                    .then(function(response)
                    {
                        $scope.banyakdicart     += 1;
                        $scope.item.STOCK_MAX   -= $scope.item.QTY_INCART;
                        $scope.itemincart.push(datatosave);
                        BarangForSaleLiteFac.UpdateBarangForSaleByDateAndItem($scope.item)
                        .then(function(response)
                        {
                            console.log(response);
                        });
                    },
                    function(error)
                    {
                        console.log(error);
                    });  
                }
            }

        });
        $scope.modal.remove();
    };

    $scope.incdec = function(incdec)
    {
        if(incdec == 'inc')
        {
            $scope.itemdecinc.STOCK_MAX         -= 1;
            if($scope.itemdecinc.STOCK_MAX >= 0) 
            {
                $scope.item.QTY_INCART  += 1;
            }    
        }
        else if(incdec == 'dec')
        {
            if($scope.item.QTY_INCART > 0)
            {
                $scope.item.QTY_INCART -= 1;   
            } 
        }
    }

    $scope.clearquantity = function()
    {
        $scope.item.QTY_INCART = 0;
    }

    $scope.gotocart     = function()
    {
        if($scope.banyakdicart > 0)
        {
            $state.go('tab.cart');
        }
        else
        {
            alert("Belum Ada Item Yang Dipilih");
        } 
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

    $scope.add = function(value) 
    {
        console.log(value);
        if($scope.expression === "" || $scope.expression === undefined) 
        {
            $scope.expression = value;
        } 
        else 
        {
            $scope.expression = $scope.expression + " " + value;
        }
    }
});
