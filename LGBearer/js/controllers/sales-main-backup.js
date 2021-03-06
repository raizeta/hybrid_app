angular.module('starter')
.controller('SalesCtrl', function($timeout,$ionicPosition,$scope,$state,$location,$ionicLoading,$ionicScrollDelegate,$ionicPopup,$ionicModal,$filter,UtilService,StorageService,BarangForSaleLiteFac,ShopCartLiteFac,TransCustLiteFac,SaveToBillLiteFac,uiGridConstants) 
{
    $scope.noresi   = StorageService.get('TRANS-ACTIVE');
    var tglsekarang = $filter('date')(new Date(),'yyyy-MM-dd');
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
            $scope.banyakdicart = $scope.itemincart.length;
        });
    }
    else
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
            StorageService.set('TRANS-ACTIVE',datacustrans.NOMOR_TRANS);
            console.log(StorageService.get('TRANS-ACTIVE'));
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
            $scope.datas = UtilService.ArrayChunk(response,5);
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
                multiSelect :false
            };

            $scope.myData = 
            [
                {
                    "id":1,
                    "namaLengkap": "Radumta Sitepu",
                    "noTelp": "081260014478",
                    "email": "radumta@gmail.com"
                },
                {
                    "id":2,
                    "namaLengkap": "Piter Novian",
                    "noTelp": "081260014478",
                    "email": "piternov@gmail.com"
                }
            ];
            
            $scope.gridOptions.onRegisterApi = function( gridApi ) 
            {
                $scope.gridApi = gridApi;
                gridApi.selection.on.rowSelectionChanged($scope,function(row)
                {
                    if(row.isSelected)
                    {
                        $scope.dataselected = row.entity;
                        $scope.editform     = true;    
                    }
                    else
                    {
                        $scope.dataselected = null;
                        $scope.editform     = false;  
                    } 
                });
            };

            $scope.gridOptions.data = $scope.myData;
            $scope.modalcustomernewtransaksi  = modal;
            $scope.modalcustomernewtransaksi.show();
            if($scope.dataselected)
            {
                $timeout(function() 
                {
                    var index = _.findIndex($scope.myData,{'id':$scope.dataselected.id});
                    $scope.gridApi.selection.selectRow($scope.gridOptions.data[index]);
                });  
            }
            
        });
    }

    $scope.ModalNewCustomerTransaksiClose = function() 
    {
        $scope.modalcustomernewtransaksi.remove();
    };

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
                    $scope.datas = UtilService.ArrayChunk(response,5);
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
                        $scope.datas = UtilService.ArrayChunk(response,5);
                    }
                    else
                    {
                        $scope.datas = [];
                    }
                    console.log($scope.datas);
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

    $scope.lakukanpembayaran = function(noresi)
    {
        
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
                $scope.datas = UtilService.ArrayChunk(response,5);
            }
            else
            {
                $scope.datas = [];
            }
        });

        TransCustLiteFac.UpdateTransCusts(['COMPLETE',$scope.noresi])
        .then(function(response)
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
    };

    $scope.lakukanpembayarannotifikasi = function(noresi)
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
            $scope.notifikasipembayaran  = modal;
            $scope.notifikasipembayaran.show();
        });
    }

    $scope.lakukanpembayarannotifikasiclose = function() 
    {
        $scope.modalpembayaran.remove();
        $scope.notifikasipembayaran.remove();
        $scope.ModalPembayaranClose();
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
            $scope.newproduct = {'ITEM_NM':null,'ITEM_HARGA':null,'STOCK_MAX':null,'GAMBAR':"img/bika-ambon.jpg"}
            $scope.tambahitemproduct  = modal;
            $scope.tambahitemproduct.show();
        });
    }

    $scope.ModalTambahItemProductClose = function() 
    {
        $scope.newproduct.ITEM_ID = "0001.0010";
        $scope.dataasli.push($scope.newproduct);
        $scope.datas = UtilService.ArrayChunk($scope.dataasli,5);
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
});
