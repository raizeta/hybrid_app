angular.module('starter')
.controller('SalesCtrl', function($rootScope,$ionicHistory,$timeout,$ionicPosition,$scope,$state,$location,$ionicLoading,$ionicScrollDelegate,$ionicPopup,$ionicModal,$filter,UtilService,ConstructorService,StorageService,uiGridConstants,TransaksiCombFac,TransCustLiteFac,ShopCartLiteFac,BarangForSaleLiteFac,TransaksiHeaderFac,TransaksiDetailFac,SaveToBillLiteFac,CustomerLiteFac,CustomerFac) 
{
    $scope.gridornot        = {grid: false};
    $scope.namacustomer     = 'NEW CUSTOMER';
    $scope.noresi           = StorageService.get('TRANS-ACTIVE');
    var tglsekarang         = $filter('date')(new Date(),'yyyy-MM-dd');
    $scope.newcusttrans     = function()
    {
        TransaksiCombFac.GetTransCustsHeaderComb(tglsekarang,$scope.profile.ACCESS_UNIX,$scope.stores.OUTLET_CODE,$scope.profile.access_token)
        .then(function(responselite)
        {
            $scope.itemincart   = [];
            $scope.noresi       = UtilService.GenerateNomorTrans(responselite,$scope.profile.ACCESS_UNIX,$scope.stores.OUTLET_CODE);
            var datatransheader = ConstructorService.TransHeaderConstructor($scope.noresi);
            TransCustLiteFac.SetTransCustsHeader(datatransheader)
            .then(function(responsesetcustheader)
            {
                console.log(responsesetcustheader);
            },
            function(errorsetcustheader)
            {
                console.log(errorsetcustheader);
            });
        });
    }

    $scope.loadproductforsale = function()
    {
        BarangForSaleLiteFac.GetBarangForSaleByDate($filter('date')(new Date(),'yyyy-MM-dd'))
        .then(function(response)
        {
            $scope.dataasli = response;
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
                $scope.datas = response;
            }
            else
            {
                $scope.datas = [];
            }
        });
    }
    if($scope.noresi)
    {
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
            $scope.loadproductforsale();
        });    
    }          
    else
    {
        $scope.newcusttrans();
        $scope.loadproductforsale();   
    }
    
    $scope.tambahqtyitem = function(item)
    {
        $scope.audio = new Audio('img/beep-07.wav');
        $scope.audio.play();
        if(item.DEFAULT_STOCK > 0)
        {
            ShopCartLiteFac.GetShopCartByItemAndNoTrans(item.ITEM_ID,$scope.noresi)
            .then(function(response)
            {
                if(angular.isDefined(item.QTY_INCART))
                {
                    item.QTY_INCART        += 1;   
                }
                else
                {
                    item.QTY_INCART         = 1;
                }
                
                item.DEFAULT_STOCK         -= 1;

                var datashopcarttosave                  = {};
                datashopcarttosave.TGL_ADDTOCART        = $filter('date')(new Date(),'yyyy-MM-dd');
                datashopcarttosave.DATETIME_ADDTOCART   = $filter('date')(new Date(),'yyyy-MM-dd HH:mm:ss');
                datashopcarttosave.NOMOR_TRANS          = $scope.noresi;
                datashopcarttosave.ITEM_ID              = item.ITEM_ID;
                datashopcarttosave.ITEM_NM              = item.ITEM_NM;
                datashopcarttosave.ITEM_HARGA           = item.DEFAULT_HARGA;
                datashopcarttosave.QTY_INCART           = item.QTY_INCART;
                datashopcarttosave.DISCOUNT             = 10;
                datashopcarttosave.IS_ONSERVER          = 0;

                if(angular.isArray(response) && response.length > 0)
                {
                    var index = _.findIndex($scope.itemincart,{'ITEM_ID': item.ITEM_ID});
                    $scope.itemincart[index].QTY_INCART += 1;
                    ShopCartLiteFac.UpdateShopCartQty(datashopcarttosave)
                    .then(function(response)
                    {
                        BarangForSaleLiteFac.UpdateBarangForSaleByDateAndItem(item)
                        .then(function(response)
                        {
                            console.log(response);
                        },
                        function(error)
                        {
                            console.log(error);
                        });
                    });  
                }
                else
                {
                    ShopCartLiteFac.SetShopCart(datashopcarttosave)
                    .then(function(response)
                    {
                        $ionicScrollDelegate.$getByHandle('scrolltobottom').scrollBottom();
                        $scope.banyakdicart     += 1;
                        $scope.itemincart.push(datashopcarttosave);
                        BarangForSaleLiteFac.UpdateBarangForSaleByDateAndItem(item)
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
            });
        } 
    }

    $scope.hitungtotal = function(datahitung)
    {
        var total = UtilService.SumPriceWithQty(datahitung,'ITEM_HARGA','QTY_INCART');  
        return total;
    }

    $scope.lakukanpembayaran = function(noresi,totalpembayaran)
    {
        $scope.totalpembayaran  = totalpembayaran;        
        $scope.yangdibayarkan   = UtilService.PembayaranFunc($scope.totalpembayaran);

        $ionicModal.fromTemplateUrl('templates/sales/modalpembayaran.html', 
        {
            scope: $scope,
            animation: 'fade-in-scale',
            backdropClickToClose: false,
            hardwareBackButtonClose: false
        })
        .then(function(modal) 
        {
            $ionicLoading.show({template: 'Loading...',duration: 500});
            $scope.pembayaran   = {'uang':$scope.totalpembayaran,'other':null};
            $scope.datamerchant = $scope.appmerchant;
            $scope.modalpembayaran  = modal;
            $scope.modalpembayaran.show();
        });
    }

    $scope.ModalPembayaranCancel = function()
    {
        $scope.modalpembayaran.remove();    
    }

    $scope.ModalPembayaranClose = function() 
    {
        $scope.namabank     = null;
        $scope.nomorrek     = null;
        if($scope.pembayaran.uang)
        {
            $scope.methodpembayaran = 0;
            $scope.ketmethod        = 'CASH';
            if($scope.pembayaran.uang >= $scope.totalpembayaran)
            {
                $scope.isEnough = true;
            }
            else
            {
                $scope.isEnough = false;
            }
        }
        else
        {
            $scope.ketmethod = $filter('uppercase')($scope.pembayaran.other);
            if($scope.pembayaran.merchant)
            {
                if($scope.pembayaran.other == 'edc')
                {
                    $scope.methodpembayaran = 1;  
                }
                else if($scope.pembayaran.other == 'acc')
                {
                    $scope.methodpembayaran = 2;  
                }

                $scope.isEnough     = true;
                $scope.namabank     = $scope.pembayaran.merchant.MERCHANT_NM;
                $scope.nomorrek     = $scope.pembayaran.merchant.MERCHANT_NO;
            }
            else
            {
                $scope.isEnough = false;
            }
            
        }
        if($scope.isEnough)
        {
            SaveToBillLiteFac.DeleteSaveToBillByNomorTrans($scope.noresi)
            .then(function(responsedeletebill)
            {
                console.log(responsedeletebill);
            },
            function(errordeletebill)
            {
                console.log(errordeletebill);
            });

            var TOTAL_ITEM = $scope.itemincart.length;
            var OLD_NORESI = $scope.noresi;
            TransCustLiteFac.UpdateTransCustsHeader(['COMPLETE',$scope.totalpembayaran,$scope.methodpembayaran,TOTAL_ITEM,$scope.namabank,$scope.nomorrek,$scope.noresi])
            .then(function(responseupdatetransheader)
            {
                $scope.newcusttrans();
                $scope.itemincart = [];
                $scope.loadproductforsale();
            },
            function(errorupdatetransheader)
            {
                console.log(errorupdatetransheader);
            });

            $scope.modalpembayaran.remove();
            $scope.lakukanpembayarannotifikasi($scope.totalpembayaran,$scope.pembayaran.uang,$scope.ketmethod,OLD_NORESI);
        }
        else
        {
            if(!$scope.pembayaran.merchant)
            {
                alert("Merchant Pembayaran Tidak Boleh Kosong");
            }
            else
            {
                alert("Uang Yang Anda Masukkan Belum Mencukupi.Terima Kasih.");     
            }
            
        }
    };

    $scope.radiochange = function(method)
    {
        if(method == 'cash')
        {
            $scope.pembayaran = {'uang':$scope.pembayaran.uang,'other':null};
        }
        else if(method == 'other')
        {
            $scope.pembayaran = {'uang':null,'other':$scope.pembayaran.other}; 
        }
    }

    $scope.lakukanpembayarannotifikasi = function(totalpembayaran,uangyangdibayarkan,ketmethod,OLD_NORESI)
    {
    
        $ionicModal.fromTemplateUrl('templates/sales/modalpembayarannotifikasi.html', 
        {
            scope: $scope,
            animation: 'fade-in-scale',
            backdropClickToClose: false,
            hardwareBackButtonClose: false
        })
        .then(function(modal) 
        {
            $ionicLoading.show({template: 'Loading...',duration: 500});
            $scope.notifikasipembayaran     = modal;
            $scope.totalpembayaran          = totalpembayaran;
            $scope.method                   = ketmethod;
            $scope.oldnoresi                = OLD_NORESI;
            if(uangyangdibayarkan)
            {
                $scope.uangyangdibayarkan       = uangyangdibayarkan;
                $scope.kembalian                = Number($scope.uangyangdibayarkan) - Number($scope.totalpembayaran);
            }
            else
            {
                $scope.uangyangdibayarkan       = 0;
                $scope.kembalian                = 0;
            }
            $scope.notifikasipembayaran.show();
        });
    }

    $scope.lakukanpembayarannotifikasiclose = function() 
    {
        TransCustLiteFac.GetTransCustsHeaderByTransId($scope.oldnoresi)
        .then(function(responsecustheaderbytransid)
        {
            if(responsecustheaderbytransid.length > 0)
            {
                var dataheader = responsecustheaderbytransid[0];
                ShopCartLiteFac.GetShopCartByNomorTrans($scope.oldnoresi)
                .then(function(responsedetail)
                {
                    if(angular.isArray(responsedetail) && responsedetail.length > 0)
                    {
                        var datadetail      = responsedetail;
                        var len             = datadetail.length;
                        for(var i = len - 1;i >= 0;i--)
                        {
                            var datadetailsaveserver    = {};
                            datadetailsaveserver.TRANS_ID           = dataheader.TRANS_ID;
                            datadetailsaveserver.ACCESS_UNIX        = dataheader.ACCESS_UNIX;
                            datadetailsaveserver.TRANS_DATE         = dataheader.TRANS_DATE;
                            datadetailsaveserver.OUTLET_ID          = dataheader.OUTLET_ID;
                            datadetailsaveserver.OUTLET_NM          = $scope.stores.OUTLET_NM;
                            datadetailsaveserver.ITEM_ID            = datadetail[i].ITEM_ID;   
                            datadetailsaveserver.ITEM_NM            = datadetail[i].ITEM_NM;
                            datadetailsaveserver.ITEM_QTY           = datadetail[i].QTY_INCART;
                            datadetailsaveserver.HARGA              = datadetail[i].ITEM_HARGA;
                            datadetailsaveserver.DISCOUNT           = datadetail[i].DISCOUNT;
                            datadetailsaveserver.DISCOUNT_STT       = 1;
                            datadetailsaveserver.STATUS             = 1;
                            datadetailsaveserver.CREATE_AT          = datadetail[i].DATETIME_ADDTOCART;
                            datadetailsaveserver.CREATE_BY          = dataheader.ACCESS_UNIX;
                            datadetailsaveserver.UPDATE_AT          = datadetail[i].DATETIME_ADDTOCART;
                            datadetailsaveserver.UPDATE_BY          = dataheader.ACCESS_UNIX;
                            TransaksiDetailFac.SetTranskasiDetail(datadetailsaveserver)
                            .then(function(responsesavedetail)
                            {
                                var datatosavedetailisonserver = {};
                                datatosavedetailisonserver.NOMOR_TRANS  = $scope.oldnoresi;
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
                                datadetail.splice(i,1);
                                if(datadetail.length == 0)
                                {                                    
                                    dataheader.STATUS             = 1;
                                    TransaksiHeaderFac.SetTranskasiHeader(dataheader)
                                    .then(function(responsetransaksiheaderfromserver)
                                    {
                                        console.log(responsetransaksiheaderfromserver);
                                        TransCustLiteFac.UpdateTransCustHeaderIsOnServer($scope.oldnoresi,responsetransaksiheaderfromserver.ID)
                                        .then(function(responseupdateheaderinonserver)
                                        {
                                            console.log("Sukses Update Status Is On Server Di Local");
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

                }); 
            }
        },
        function(errorcustheaderbytransid)
        {
            console.log(errorcustheaderbytransid);
        });
        $scope.namacustomer = 'NEW CUSTOMER';
        $scope.modalpembayaran.remove();
        $scope.notifikasipembayaran.remove();
    };

    $scope.TambahItemProduct = function(noresi)
    {
        $ionicModal.fromTemplateUrl('templates/sales/modaltambahitemproduct.html', 
        {
            scope: $scope,
            animation: 'fade-in-scale',
            backdropClickToClose: false,
            hardwareBackButtonClose: false
        })
        .then(function(modal) 
        {
            var sortproduct             = _.sortBy($scope.datas, 'ITEM_ID');
            var lastitemid              = sortproduct[sortproduct.length - 1].ITEM_ID;
            $scope.newproduct           = ConstructorService.ProductConstructor(lastitemid);
            $scope.tambahitemproduct    = modal;
            $scope.tambahitemproduct.show();
        });
    }

    $scope.ModalTambahItemProductClose = function() 
    {
        $scope.datas.push($scope.newproduct);
        BarangForSaleLiteFac.SetBarangForSale($scope.newproduct)
        .then(function(responsesetbarang)
        {
            console.log(responsesetbarang);
        },
        function(error)
        {
            console.log(error);
        });
        $scope.tambahitemproduct.remove();
    };

    $scope.ModalTambahItemProductCancel = function() 
    {
        $scope.tambahitemproduct.remove();
    };

    $scope.newcustomertransaksi = function()
    {
        $ionicModal.fromTemplateUrl('templates/sales/modalnewcustomertransaksi.html', 
        {
            scope: $scope,
            animation: 'fade-in-scale',
            backdropClickToClose: false,
            hardwareBackButtonClose: false
        })
        .then(function(modal) 
        {
            $scope.gridOptions = 
            {
                enableRowSelection: true,
                enableSelectAll: false,
                selectionRowHeaderWidth: 35,
                rowHeight: 35,
                multiSelect :false,
                enableFiltering: false,
                columnDefs: [{ field: 'NAME' },{ field: 'EMAIL' },{ field: 'PHONE' }]
            };

            $scope.gridOptions.onRegisterApi = function( gridApi ) 
            {
                $scope.gridApi = gridApi;
                $scope.gridApi.grid.registerRowsProcessor($scope.singleFilter, 200 );
                gridApi.selection.on.rowSelectionChanged($scope,function(row)
                {
                    if(row.isSelected)
                    {
                        $scope.dataselected = row.entity;   
                    }
                    else
                    {
                        $scope.dataselected = null;
                    } 
                });
            };

            $scope.filterValue = '';
            $scope.singleFilter = function( renderableRows )
            {
                var matcher = new RegExp($scope.filterValue);
                renderableRows.forEach( function( row ) 
                {
                      var match = false;
                      [ 'NAME'].forEach(function( field )
                      {
                        if ( row.entity[field].match(matcher) )
                        {
                          match = true;
                        }
                      });
                      if ( !match )
                      {
                        row.visible = false;
                      }
                });
                return renderableRows;
            };

            CustomerLiteFac.GetCustomer($scope.profile.ACCESS_UNIX,$scope.stores.OUTLET_CODE)
            .then(function(responsecustomer)
            {
                $scope.openbookdata ={'exist':'true'};
                $scope.myData = responsecustomer;
                $scope.gridOptions.data             = $scope.myData;
                $scope.newcustomer                  = ConstructorService.CustomerConstructor();
                $scope.modalcustomernewtransaksi    = modal;
                $scope.modalcustomernewtransaksi.show();
                TransCustLiteFac.GetTransCustsHeaderByTransId($scope.noresi)
                .then(function(responsenomortrans)
                {
                    if(responsenomortrans.length > 0)
                    {
                        $scope.namacustomer = responsenomortrans[0].CONSUMER_NM;

                        $timeout(function() 
                        {
                            var index = _.findIndex($scope.gridOptions.data,{NAME:responsenomortrans[0].CONSUMER_NM})
                            $scope.gridApi.selection.selectRow($scope.gridOptions.data[index]);
                        });   
                    }
                },
                function(error)
                {
                    console.log(error);
                });
            },
            function(error)
            {
                console.log(error);
            });
        });
    }
    
    $scope.filtertable = function(filterValue) 
    {
        $scope.filterValue = filterValue;
        $scope.gridApi.grid.refresh();
    };

    $scope.ModalNewCustomerTransaksiClose = function() 
    {
        if($scope.openbookdata.exist == 'false')
        {
            $scope.namacustomer            = $scope.newcustomer.NAME;
            CustomerLiteFac.SetCustomer($scope.newcustomer)
            .then(function(responsesetcustomer)
            {
                var datatosave = [$scope.newcustomer.NAME,$scope.newcustomer.EMAIL,$scope.newcustomer.PHONE,$scope.noresi];
                TransCustLiteFac.UpdateTransCustsHeaderBuyer(datatosave)
                .then(function(response)
                {
                    console.log(response);    
                },
                function(error)
                {
                    console.log(error);
                });
                CustomerFac.SetCustomer($scope.newcustomer)
                .then(function(responsecustomerserver)
                {
                    console.log(responsecustomerserver);
                },
                function(errorcustomerserver)
                {
                    console.log(errorcustomerserver);
                })
            });     
        }

        if($scope.dataselected)
        {
            var datatosave = [$scope.dataselected.NAME,$scope.dataselected.EMAIL,$scope.dataselected.PHONE,$scope.noresi];
            TransCustLiteFac.UpdateTransCustsHeaderBuyer(datatosave)
            .then(function(response)
            {
                console.log(response);
                
            },
            function(error)
            {
                console.log(error)
            });
            $scope.namacustomer = $scope.dataselected.NAME;
        }
        $scope.modalcustomernewtransaksi.remove();
    };

    $scope.ModalNewCustomerTransaksiCancel = function()
    {
        $scope.modalcustomernewtransaksi.remove();
    }

});
