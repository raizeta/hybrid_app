angular.module('starter')
.controller('SalesCtrl', function($rootScope,$ionicHistory,$timeout,$ionicPosition,$scope,$state,$location,$ionicLoading,$ionicScrollDelegate,$ionicPopup,$ionicModal,$filter,UtilService,StorageService,BarangForSaleLiteFac,ShopCartLiteFac,TransCustLiteFac,SaveToBillLiteFac,CloseBookLiteFac,CustomerLiteFac,uiGridConstants,SummaryLiteFac,HargaLiteFac,TransaksiHeaderFac,TransaksiDetailFac) 
{
    $scope.gridornot        = {grid: false};
    $scope.namacustomer     = 'NEW CUSTOMER';
    $scope.changefilter = function(valeu)
    {
        $scope.filterproduct = valeu;
    }
    CloseBookLiteFac.GetCloseBookByUsername($scope.profile.username)
    .then(function(responseclosebook)
    {
        if (responseclosebook.length > 1)
        {
            if(responseclosebook[responseclosebook.length - 1].NAMA_TYPE == 'CLOSEBOOK')
            {
                $timeout(function() 
                {
                    $ionicHistory.nextViewOptions({disableAnimate: true, disableBack: true});
                    $state.go('tab.notifikasiclosebook', {}, {reload: true});   
                }, 10);
            }
        }
    },
    function(errorgetclosebook)
    {
        console.log(errorgetclosebook);
    });

    $scope.checkout = function()
    {
        var confirmPopup =  $ionicPopup.confirm(
                            {
                                title: 'Close Book',
                                template: 'Are you sure to close this book?'
                            });
        confirmPopup.then(function(res) 
        {
            if(res) 
            {
                $ionicModal.fromTemplateUrl('templates/sales/modalopenbookclosed.html', 
                {
                    scope: $scope,
                    animation: 'fade-in-scale',
                    backdropClickToClose: false,
                    hardwareBackButtonClose: false
                })
                .then(function(modal) 
                {
                    $state.go('tab.closebook', {}, {reload: true});
                });  
            } 
        });     
    }

    $scope.noresi   = StorageService.get('TRANS-ACTIVE');
    var tglsekarang = $filter('date')(new Date(),'yyyy-MM-dd');
    if($scope.noresi)
    {
        ShopCartLiteFac.GetShopCartByNomorTrans($scope.noresi)
        .then(function(response)
        {
            console.log(response);
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

        TransCustLiteFac.GetNomorTransWhere($scope.noresi)
        .then(function(responsenomortrans)
        {
            if(responsenomortrans.length > 0)
            {
                $scope.namacustomer = responsenomortrans[0].BUYER_NAME;   
            }
        },
        function(error)
        {
            console.log(error);
        });
    }
    else
    {
        $scope.itemincart = [];
        TransCustLiteFac.GetTransCustsByDate(tglsekarang)
        .then(function(responselite)
        {
            var datacustrans = {};
            datacustrans.TGL_TRANS          = $filter('date')(new Date(),'yyyy-MM-dd');
            datacustrans.CASHIER_ID         = $scope.profile.id;
            datacustrans.CASHIER_NAME       = $scope.profile.username;
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
            $scope.noresi   = datacustrans.NOMOR_TRANS;
            StorageService.set('TRANS-ACTIVE',datacustrans.NOMOR_TRANS);
            TransCustLiteFac.SetTransCusts(datacustrans)
            .then(function(response)
            {
                console.log();
            },
            function(error)
            {
                console.log(error);
            });
        });
    }

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

    $scope.datastores = [{'OUTLET_NM':'Makananan'},{'OUTLET_NM':'Minuman'},{'OUTLET_NM':'Snack'}]
    $scope.AddToCart = function(item) 
    {
        $scope.itemasli     = angular.copy(item);
        $scope.itemdecinc   = angular.copy(item);
        $ionicModal.fromTemplateUrl('templates/sales/modaladdtocart.html', 
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
                    var index = _.findIndex($scope.itemincart,{'ITEM_ID':$scope.itemdecinc.ITEM_ID});
                    $scope.itemincart.splice(index,1);
                    $scope.audio = new Audio('wav/recycle.wav');
                    $scope.audio.play(); 
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
        
        var index = _.findIndex($scope.itemincart,{'ITEM_ID':$scope.itemdecinc.ITEM_ID});
        if(incdec == 'inc')
        {
            $scope.audio = new Audio('img/beep-07.wav');
            $scope.audio.play();
            $scope.itemdecinc.STOCK_MAX         -= 1;
            if($scope.itemdecinc.STOCK_MAX >= 0) 
            {
                $scope.item.QTY_INCART  += 1;
                $scope.itemincart[index].QTY_INCART += 1;
            }    
        }
        else if(incdec == 'dec')
        {
            $scope.audio = new Audio('img/beep-5.wav');
            $scope.audio.play();
            if($scope.item.QTY_INCART > 0)
            {
                $scope.item.QTY_INCART -= 1; 
                $scope.itemincart[index].QTY_INCART -= 1;  
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

    $scope.hitungtotal = function(datahitung)
    {
        var total = UtilService.SumPriceWithQty(datahitung,'ITEM_HARGA','QTY_INCART');  
        return total;
    }

    $scope.tambahqtyitem = function(item)
    {
        $scope.audio = new Audio('img/beep-07.wav');
        $scope.audio.play();
        if(item.STOCK_MAX > 0)
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
                
                item.STOCK_MAX             -= 1;

                var datatosave              = {};
                datatosave.NOMOR_TRANS      = $scope.noresi;
                datatosave.ITEM_ID          = item.ITEM_ID;
                datatosave.ITEM_NM          = item.ITEM_NM;
                datatosave.ITEM_HARGA       = item.ITEM_HARGA;
                datatosave.QTY_INCART       = item.QTY_INCART;
                datatosave.STOCK_MAX        = item.STOCK_MAX;
                datatosave.DISCOUNT         = 10;

                if(angular.isArray(response) && response.length > 0)
                {
                    var index = _.findIndex($scope.itemincart,{'ITEM_ID': item.ITEM_ID});
                    $scope.itemincart[index].QTY_INCART += 1;
                    ShopCartLiteFac.UpdateShopCartQty(datatosave)
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

                    ShopCartLiteFac.SetShopCart(datatosave)
                    .then(function(response)
                    {
                        $ionicScrollDelegate.$getByHandle('scrolltobottom').scrollBottom();
                        $scope.banyakdicart     += 1;
                        $scope.itemincart.push(datatosave);
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
                columnDefs: [{ field: 'NAMA_CUST' },{ field: 'EMAIL_CUST' },{ field: 'NO_TELP' }]
            };

            $scope.gridOptions.onRegisterApi = function( gridApi ) 
            {
                $scope.gridApi = gridApi;
                $scope.gridApi.grid.registerRowsProcessor($scope.singleFilter, 200 );
                gridApi.selection.on.rowSelectionChanged($scope,function(row)
                {
                    console.log(row);
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
                      [ 'NAMA_CUST', 'EMAIL_CUST'].forEach(function( field )
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

            CustomerLiteFac.GetCustomer()
            .then(function(responsecustomer)
            {
                $scope.openbookdata ={'exist':'true'};
                $scope.myData = responsecustomer;
                

                $scope.gridOptions.data = $scope.myData;
                $scope.datanew          = {'NAMA_CUST':null,'EMAIL_CUST':null,'NO_TELP':null}
                $scope.modalcustomernewtransaksi  = modal;
                $scope.modalcustomernewtransaksi.show();
                TransCustLiteFac.GetNomorTransWhere($scope.noresi)
                .then(function(responsenomortrans)
                {
                    if(responsenomortrans.length > 0)
                    {
                        $scope.namacustomer = responsenomortrans[0].BUYER_NAME;
                        $timeout(function() 
                        {
                            var index = _.findIndex($scope.gridOptions.data,{id:Number(responsenomortrans[0].BUYER_ID)})
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
        console.log($scope.dataselected);
        if($scope.openbookdata.exist == 'false')
        {
            var namacustomer = $scope.datanew.NAMA_CUST;
            CustomerLiteFac.SetCustomer($scope.datanew)
            .then(function(responsesetcustomer)
            {
                var datatosave = [responsesetcustomer.insertId,$scope.datanew.NAMA_CUST,$scope.noresi];
                TransCustLiteFac.UpdateBuyerTransCusts(datatosave)
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

        if($scope.dataselected)
        {
            var datatosave = [$scope.dataselected.id,$scope.dataselected.NAMA_CUST,$scope.noresi];
            TransCustLiteFac.UpdateBuyerTransCusts(datatosave)
            .then(function(response)
            {
                console.log(response);
                
            },
            function(error)
            {
                console.log(error)
            });
            var namacustomer = $scope.dataselected.NAMA_CUST;
        }
        $scope.namacustomer = namacustomer;
        $scope.modalcustomernewtransaksi.remove();
    };

    $scope.ModalNewCustomerTransaksiCancel = function()
    {
        $scope.modalcustomernewtransaksi.remove();
    }
    $scope.savetobill     = function()
    {
        $ionicModal.fromTemplateUrl('templates/sales/modalsavetobill.html', 
        {
            scope: $scope,
            animation: 'fade-in-scale',
            backdropClickToClose: true,
            hardwareBackButtonClose: false,
            backdrop:false
        })
        .then(function(modal) 
        {
            SaveToBillLiteFac.GetSaveToBillByDate()
            .then(function(responselite)
            {
                console.log(responselite);
                $scope.listbill = responselite;
            });
            $scope.savetobillmodal  = modal;
            $scope.billidentity     = $scope.noresi;
            $scope.savetobillmodal.show();
        });
    }

    $scope.ModalSaveToBillCancel = function()
    {
        $scope.savetobillmodal.remove();   
    }
    
    $scope.ModalSaveToBillClose = function() 
    {
        if($scope.itemincart.length > 0)
        {
            SaveToBillLiteFac.GetSaveToBillByNomorTrans($scope.noresi)
            .then(function(responsesavebill)
            {
                if(responsesavebill.length == 0)
                {
                    var datatosavebill = {};
                    datatosavebill.NOMOR_TRANS = $scope.noresi;
                    if($scope.billidentity != $scope.noresi)
                    {
                        datatosavebill.ALIAS_TRANS = $scope.billidentity;
                    }
                    else
                    {
                        datatosavebill.ALIAS_TRANS = '';
                    }
                    console.log(datatosavebill);
                    SaveToBillLiteFac.SetSaveToBill(datatosavebill)
                    .then(function(responsesave)
                    {
                        console.log(responsesave);
                    },
                    function(error)
                    {
                        console.log(error);
                    });
                }
            },
            function(error)
            {
                console.log(error);
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
                            response[itemaddtocart].QTY_INCART = null;
                        }
                    });
                    $scope.datas = response;
                }
                else
                {
                    $scope.datas = [];
                }
            });

            TransCustLiteFac.GetTransCustsByDate(tglsekarang)
            .then(function(responselite)
            {
                var datacustrans = {};
                datacustrans.TGL_TRANS          = $filter('date')(new Date(),'yyyy-MM-dd');
                datacustrans.DATETIME_TRANS     = $filter('date')(new Date(),'yyyy-MM-dd HH:mm:ss');
                datacustrans.CASHIER_ID         = $scope.profile.id;
                datacustrans.CASHIER_NAME       = $scope.profile.username;
                datacustrans.STATUS_BUY         = 'INCOMPLETE';
                if(responselite.length > 0)
                {
                    var lastbookingserialnumber     = responselite[responselite.length - 1].NOMOR_TRANS;
                    var lastthree                   = lastbookingserialnumber.substr(lastbookingserialnumber.length - 3);
                    var nomorurut                   = UtilService.StringPad(Number(lastthree) + 1,'000');
                    datacustrans.NOMOR_TRANS        = 'LG.RS.KB.' + $filter('date')(new Date(),'yyyy.MM.dd') + '.' + nomorurut; 
                }
                StorageService.set('TRANS-ACTIVE',datacustrans.NOMOR_TRANS);
                $scope.noresi = datacustrans.NOMOR_TRANS;
                $scope.itemincart = [];
                TransCustLiteFac.SetTransCusts(datacustrans)
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
            alert("Belum Ada Item Yang Dipilih.Minimal Harus Ada Satu Item.");    
        }
        
        $scope.savetobillmodal.remove();
    };

    $scope.loadfrombill = function(item)
    {
        StorageService.set('TRANS-ACTIVE',item.NOMOR_TRANS);
        $scope.noresi = item.NOMOR_TRANS;
        
        ShopCartLiteFac.GetShopCartByNomorTrans(item.NOMOR_TRANS)
        .then(function(response)
        {
            if(angular.isArray(response) && response.length > 0)
            {
                $scope.itemincart = response;
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
                                response[itemaddtocart].QTY_INCART = value.QTY_INCART;
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
            else
            {
                $scope.itemincart = [];
            }
            $scope.banyakdicart = $scope.itemincart.length;
        });
        $scope.savetobillmodal.remove();

    }

    $scope.lakukanpembayaran = function(noresi,totalpembayaran)
    {
        var totalpembayaran     = totalpembayaran;
        $scope.totalpembayaran  = totalpembayaran;
        var prediksi
        $scope.yangdibayarkan   = [
                                    {'yangdibayar':$scope.totalpembayaran}
                                 ]

        var berapakalidibagi1        = Math.floor(totalpembayaran / 1000);
        var berapakalidibagi2        = Math.floor(totalpembayaran / 2000);
        var berapakalidibagi3        = Math.floor(totalpembayaran / 5000);

        var sisabagi1               = Math.floor(totalpembayaran % 1000);
        var sisabagi2               = Math.floor(totalpembayaran % 2000);
        var sisabagi3               = Math.floor(totalpembayaran % 5000);

        var hasilbagi1              = (berapakalidibagi1 + 1) * 1000;
        var hasilbagi2              = (berapakalidibagi2 + 1) * 2000;
        var hasilbagi3              = (berapakalidibagi3 + 1) * 5000;

        var indexhasilbagi1         = _.findIndex($scope.yangdibayarkan,{'yangdibayar':hasilbagi1});
        
    
        if(indexhasilbagi1 == -1)
        {
            $scope.yangdibayarkan.push({'yangdibayar': hasilbagi1});    
        }
        var indexhasilbagi2         = _.findIndex($scope.yangdibayarkan,{'yangdibayar':hasilbagi2});
        if(indexhasilbagi2 == -1)
        {
            $scope.yangdibayarkan.push({'yangdibayar': hasilbagi2});    
        }
        var indexhasilbagi3         = _.findIndex($scope.yangdibayarkan,{'yangdibayar':hasilbagi3});
        if(indexhasilbagi3 == -1)
        {
            $scope.yangdibayarkan.push({'yangdibayar': hasilbagi3});    
        }

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
            $scope.datastores   = [{'OUTLET_NM':'MANDIRI'},{'OUTLET_NM':'BANK BCA'}];
            $scope.namaaccount  = null;
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
        if($scope.pembayaran.uang)
        {
            $scope.methodpembayaran = 'CASH';
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
            $scope.methodpembayaran = $filter('uppercase')($scope.pembayaran.other);
            $scope.isEnough = true;
        }
        if($scope.isEnough)
        {
            SaveToBillLiteFac.DeleteSaveToBillByNomorTrans($scope.noresi)
            .then(function(responsedeletebill)
            {
                console.log(responsedeletebill);
            },
            function(error)
            {
                console.log(error);
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
                            response[itemaddtocart].QTY_INCART = null;
                        }
                    });
                    $scope.datas = response;
                }
                else
                {
                    $scope.datas = [];
                }
            });
            var TOTAL_ITEM = $scope.itemincart.length;
            var OLD_NORESI = $scope.noresi;
            TransCustLiteFac.UpdateTransCusts(['COMPLETE',$scope.totalpembayaran,$scope.methodpembayaran,TOTAL_ITEM,$scope.noresi])
            .then(function(response)
            {
                TransCustLiteFac.GetTransCustsByDate(tglsekarang)
                .then(function(responselite)
                {
                    var datacustrans = {};
                    datacustrans.TGL_TRANS          = $filter('date')(new Date(),'yyyy-MM-dd');
                    datacustrans.DATETIME_TRANS     = $filter('date')(new Date(),'yyyy-MM-dd HH:mm:ss');
                    datacustrans.CASHIER_ID         = $scope.profile.id;
                    datacustrans.CASHIER_NAME       = $scope.profile.username;
                    datacustrans.STATUS_BUY         = 'INCOMPLETE';
                    if(responselite.length > 0)
                    {
                        var lastbookingserialnumber     = responselite[responselite.length - 1].NOMOR_TRANS;
                        var lastthree                   = lastbookingserialnumber.substr(lastbookingserialnumber.length - 3);
                        var nomorurut                   = UtilService.StringPad(Number(lastthree) + 1,'000');
                        datacustrans.NOMOR_TRANS        = 'LG.RS.KB.' + $filter('date')(new Date(),'yyyy.MM.dd') + '.' + nomorurut; 
                    }
                    StorageService.set('TRANS-ACTIVE',datacustrans.NOMOR_TRANS);
                    $scope.noresi = datacustrans.NOMOR_TRANS;
                    $scope.itemincart = [];
                    TransCustLiteFac.SetTransCusts(datacustrans)
                    .then(function(response)
                    {
                        console.log(response);
                    },
                    function(error)
                    {
                        console.log(error);
                    });
                });
            },
            function(error)
            {
                console.log(error);
            });

            $scope.modalpembayaran.remove();
            $scope.lakukanpembayarannotifikasi($scope.totalpembayaran,$scope.pembayaran.uang,$scope.methodpembayaran,OLD_NORESI);
        }
        else
        {
            alert("Uang Yang Anda Masukkan Belum Mencukupi.Terima Kasih.");
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

    $scope.lakukanpembayarannotifikasi = function(totalpembayaran,uangyangdibayarkan,method,OLD_NORESI)
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
            $scope.method                   = method;
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
        TransCustLiteFac.GetNomorTransWhere($scope.oldnoresi)
        .then(function(responsenomortrans)
        {
            if(responsenomortrans.length > 0)
            {
                var stores      = StorageService.get('LokasiStore');
                var lastthree   = $scope.oldnoresi.substr($scope.oldnoresi.length - 3);
                var TRANS_ID    = $scope.profile.ACCESS_UNIX + '.' + stores.OUTLET_CODE + '.' + $filter('date')(new Date(),'yyyyMMdd') + (Number(lastthree));
                var OUTLET_ID   = stores.OUTLET_CODE;
                var OUTLET_NM   = stores.OUTLET_NM;

                ShopCartLiteFac.GetShopCartByNomorTrans($scope.oldnoresi)
                .then(function(responsedetail)
                {
                    if(angular.isArray(responsedetail) && responsedetail.length > 0)
                    {
                        var dataxxx         = responsedetail;
                        var len             = dataxxx.length;
                        for(var i = len - 1;i >= 0;i--)
                        {
                            console.log("I " + i);
                            var datadetailsaveserver    = {};
                            datadetailsaveserver.TRANS_ID           = TRANS_ID;
                            datadetailsaveserver.ACCESS_UNIX        = $scope.profile.ACCESS_UNIX;
                            datadetailsaveserver.TRANS_DATE         = dataxxx[i].TGL_ADDTOCART;
                            datadetailsaveserver.OUTLET_ID          = OUTLET_ID;
                            datadetailsaveserver.OUTLET_NM          = OUTLET_NM;
                            datadetailsaveserver.ITEM_ID            = dataxxx[i].ITEM_ID;   
                            datadetailsaveserver.ITEM_NM            = dataxxx[i].ITEM_NM;
                            datadetailsaveserver.ITEM_QTY           = dataxxx[i].QTY_INCART;
                            datadetailsaveserver.HARGA              = dataxxx[i].ITEM_HARGA;
                            datadetailsaveserver.DISCOUNT           = dataxxx[i].DISCOUNT;
                            datadetailsaveserver.DISCOUNT_STT       = 1;
                            datadetailsaveserver.STATUS             = 1;
                            datadetailsaveserver.CREATE_AT          = dataxxx[i].DATETIME_ADDTOCART;
                            datadetailsaveserver.CREATE_BY          = $scope.profile.ACCESS_UNIX;
                            datadetailsaveserver.UPDATE_AT          = dataxxx[i].DATETIME_ADDTOCART;
                            datadetailsaveserver.UPDATE_BY          = $scope.profile.ACCESS_UNIX;
                            TransaksiDetailFac.SetTranskasiDetail(datadetailsaveserver)
                            .then(function(responsesavedetail)
                            {
                                var datatosavedetailisonserver = {};
                                datatosavedetailisonserver.NOMOR_TRANS  = $scope.oldnoresi;
                                datatosavedetailisonserver.ITEM_ID      = responsesavedetail.ITEM_ID;
                                console.log(datatosavedetailisonserver);
                                ShopCartLiteFac.UpdateIsOnServer(datatosavedetailisonserver)
                                .then(function(responseupdatestatusisonserver)
                                {
                                    console.log("Update Status Detail Ke Local Sukses");
                                },
                                function(errorupdatestatusinonserver)
                                {
                                    console.log("Update Status Detail Ke Local Gagal");
                                });
                                dataxxx.splice(i,1);
                                if(dataxxx.length == 0)
                                {
                                    var datasendtoserver                = {};
                                    datasendtoserver.TRANS_ID           = TRANS_ID;
                                    datasendtoserver.ACCESS_UNIX        = $scope.profile.ACCESS_UNIX;
                                    datasendtoserver.TRANS_DATE         = $filter('date')(new Date(),'yyyy-MM-dd');
                                    datasendtoserver.OUTLET_ID          = OUTLET_ID;
                                    datasendtoserver.TOTAL_ITEM         = responsenomortrans[0].TOTAL_ITEM;   
                                    datasendtoserver.TOTAL_HARGA        = responsenomortrans[0].TOTAL_SPENT;
                                    datasendtoserver.CONSUMER_NM        = responsenomortrans[0].BUYER_NAME;
                                    datasendtoserver.CONSUMER_EMAIL     = responsenomortrans[0].BUYER_NAME;
                                    datasendtoserver.CONSUMER_PHONE     = responsenomortrans[0].BUYER_NAME;
                                    datasendtoserver.STATUS             = 1;
                                    datasendtoserver.CREATE_AT          = responsenomortrans[0].DATETIME_TRANS;
                                    datasendtoserver.CREATE_BY          = $scope.profile.ACCESS_UNIX;
                                    datasendtoserver.UPDATE_AT          = responsenomortrans[0].DATETIME_TRANS;
                                    datasendtoserver.UPDATE_BY          = $scope.profile.ACCESS_UNIX;
                                    TransaksiHeaderFac.SetTranskasiHeader(datasendtoserver)
                                    .then(function(responseserver)
                                    {
                                        console.log("Sukses Menyimpan Header Ke Server");
                                        TransCustLiteFac.UpdateIsOnServer($scope.oldnoresi)
                                        .then(function(responseheaderinonserver)
                                        {
                                            console.log("Sukses Update Status Is On Server Di Local");
                                        },
                                        function(errorupdateisonserver)
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
        function(error)
        {
            console.log(error);
        });
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
            $ionicLoading.show({template: 'Loading...',duration: 500});
            $scope.newproduct = {'ITEM_NM':null,'ITEM_HARGA':null,'STOCK_MAX':null,'SATUAN':'','GAMBAR':"img/bika-ambon.jpg"}
            $scope.tambahitemproduct  = modal;
            $scope.tambahitemproduct.show();
        });
    }

    $scope.ModalTambahItemProductClose = function() 
    {
        var xxx                         = _.sortBy($scope.datas, 'ITEM_ID');
        var last                        = xxx[xxx.length - 1].ITEM_ID;
        var lastthree                   = last.substr(last.length - 4);
        var nomorurut                   = UtilService.StringPad(Number(lastthree) + 1,'0000');
        $scope.newproduct.ITEM_ID = nomorurut;
        $scope.datas.push($scope.newproduct);
        var stores              = StorageService.get('LokasiStore');
        var databarangtosave    = {};
        databarangtosave.TGL_SAVE     = $filter('date')(new Date(),'yyyy-MM-dd');
        databarangtosave.ITEM_ID      = nomorurut;
        databarangtosave.ITEM_NM      = $scope.newproduct.ITEM_NM;
        databarangtosave.ITEM_HARGA   = $scope.newproduct.ITEM_HARGA;
        databarangtosave.STOCK_MAX    = $scope.newproduct.STOCK_MAX;
        databarangtosave.GAMBAR       = $scope.newproduct.GAMBAR;
        databarangtosave.FORMULA      = null;
        databarangtosave.OUTLET_CODE  = stores.OUTLET_CODE;
        databarangtosave.SATUAN       = $scope.newproduct.SATUAN;
        databarangtosave.STATUS       = 1;
        databarangtosave.IS_ONSERVER  = 0;
        BarangForSaleLiteFac.SetBarangForSale(databarangtosave)
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

    $scope.deletecart = function()
    {
        var confirmPopup =  $ionicPopup.confirm(
                            {
                                title: 'Delete Bill',
                                template: 'Are you sure to delete this bill number?'
                            });
        confirmPopup.then(function(res) 
        {
            if(res) 
            {
                console.log("Sukses Menghapus");

            } 
        });
    }

    // var stores     = StorageService.get('LokasiStore');
    // HargaLiteFac.GetHarga(stores.OUTLET_CODE,'2017-04-23','2017-04-24')
    // .then(function(responseharga)
    // {
    //     $scope.harga    = responseharga;
    // },
    // function(errorharga)
    // {
    //     console.log(errorharga)
    // });

    $scope.findharga    = function(itemsproduct,$index)
    {
        var indexharga  = _.findIndex($scope.harga,{'ITEM_ID':itemsproduct.ITEM_ID});
        if(indexharga > -1)
        {
            $scope.datas[$index].ITEM_HARGA = $scope.harga[indexharga].ITEM_HARGA;   
        }
    }
});
