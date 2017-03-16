angular.module('starter')
.controller('InventoryCtrl', function($scope,$ionicLoading,$filter,$ionicPopup,$ionicModal,UtilService,StorageService,ProductFac,TransaksiHeaderFac,TransaksiFac) 
{
	$scope.tglsekarang  = $filter('date')(new Date(),'yyyy-MM-dd');
    var kemarin     = new Date();
    kemarin.setDate(kemarin.getDate() - 1);
    var lokasistore     = StorageService.get('LokasiStore');
    $scope.profile      = StorageService.get('profile');
    var invstatus       = StorageService.get('InventoryStatus');
    var productserver   = StorageService.get('ProductServer');
    if(!productserver)
    {
        ProductFac.GetProducts(lokasistore.OUTLET_BARCODE)
        .then(function(response)
        {
            productserver = response;
            StorageService.set('ProductServer',response);
        },
        function(err)
        {
            console.log(err);
        })
        .finally(function()
        {

        });   
    }

    $scope.gettransaksi = function()
    {
        TransaksiFac.GetTransaksis(lokasistore.OUTLET_BARCODE,$scope.tglinv,$scope.typeinv)
        .then(function(response)
        {
            $scope.datas = [];
            angular.forEach(response,function(value,key)
            {
                var indexproductserver =  _.findIndex(productserver, {'ITEM_BARCODE': value.ITEM_ID});
                value.qtychecked    = value.ITEM_QTY;
                value.formula       = productserver[indexproductserver].formula
                if($scope.typeinv == 3)
                {
                    value.sudahdicheckbelum = 'CHECKED';  
                }
                
                $scope.datas.push(value);
            });
        },
        function(err)
        {
            console.log(err);
        })
        .finally(function()
        {

        });
    }
    if(invstatus)
    {
        if((invstatus.tanggalcheck == $scope.tglsekarang) && (invstatus.statuscheck     == 'CHECKED'))
        {
           $scope.typeinv = 3;
           $scope.tglinv  = $scope.tglsekarang;
           $scope.datas   = StorageService.get('BrgPenjualan');
        }
        else
        {
            StorageService.destroy('BrgPenjualan');
            StorageService.destroy('barangpenjualan');
            StorageService.destroy('notransaksi');
            StorageService.destroy('LastBooking');
            var bookingtransaksi = StorageService.get('bookingtransaksi');
            angular.forEach(bookingtransaksi,function(value,key)
            {
                console.log(value);
                StorageService.destroy(value.notransk);
            });
            StorageService.destroy('bookingtransaksi');
            $scope.typeinv  = 2;
            $scope.tglinv   = $scope.tglsekarang;
            $scope.gettransaksi();
        }
    }
    else
    {
        StorageService.destroy('BrgPenjualan');
        StorageService.destroy('barangpenjualan');
        StorageService.destroy('notransaksi');
        StorageService.destroy('LastBooking');
        var bookingtransaksi = StorageService.get('bookingtransaksi');
        angular.forEach(bookingtransaksi,function(value,key)
        {
            StorageService.destroy(value.notransaksi);
        });
        StorageService.get('bookingtransaksi');
        $scope.typeinv  = 2;
        $scope.tglinv   = $scope.tglsekarang;
        $scope.gettransaksi();
    }
    
    $scope.incdec = function(incordec,items)
    {
        if($scope.typeinv == 2)
        {
            var indexarrayasli = _.findIndex($scope.datas, {'ITEM_ID': items.ITEM_ID});
            if(incordec == 'inc')
            {
                $scope.datas[indexarrayasli].qtychecked += 1;
            }
            else if(incordec == 'dec')
            {
                $scope.datas[indexarrayasli].qtychecked -= 1;
            }
        }
        else
        {
            alert("Sudah Di Re-Checked.Tidak Bisa Lagi Diganggu Gugat");
        }
    }

    $scope.submitinventory = function(datafromview)
    {
        var confirmPopup = $ionicPopup.confirm(
        {
            title: 'Submit Inventory',
            template: 'Are you sure to submit this inventory to Server?'
        });
        confirmPopup.then(function(res) 
        {
            if(res) 
            {
                var datadetail = angular.copy(datafromview);
                StorageService.set('BrgPenjualan',datadetail);
                var dataheader  = {'OUTLET_ID':datadetail[0].OUTLET_ID,'TRANS_TYPE':3};
                $ionicLoading.show
                ({
                  template: 'Saving...'
                })
                .then(function()
                {
                    TransaksiHeaderFac.SetTranskasiHeader(dataheader)
                    .then(function(responseserver)
                    {
                        if(responseserver.handling == "exist")
                        {
                            console.log("Sudah Ada");
                        }
                        else
                        {
                            angular.forEach(datadetail,function(value,key)
                            {
                                value.ITEM_QTY          = value.qtychecked;
                                value.TYPE              = 'RCVD';
                                value.TRANS_ID          = responseserver.TRANS_ID;
                                value.TRANS_TYPE        = 3;
                                value.USER_ID           = $scope.profile.id;
                                value.CREATE_BY         = $scope.profile.id;
                                value.CREATE_AT         = $filter('date')(new Date(),'yyyy-MM-dd H:m:s');
                                
                                TransaksiFac.SetTranskasi(value)
                                .then(function(response)
                                {
                                    $scope.typeinv = 3 
                                    var statusinventory = {};
                                    statusinventory.statuscheck     = 'CHECKED';
                                    statusinventory.tanggalcheck    = $scope.tglsekarang;
                                    StorageService.set('InventoryStatus',statusinventory);
                                },
                                function(error)
                                {
                                    var statusinventory = {};
                                    statusinventory.statuscheck     = 'CHECKED';
                                    statusinventory.tanggalcheck    = $scope.tglsekarang;
                                    StorageService.set('InventoryStatus',statusinventory);
                                    $scope.typeinv = 2;
                                })
                                .finally(function()
                                {

                                });
                            });
                        }
                    },
                    function(error)
                    {
                        console.log(error);
                    })
                    .finally(function()
                    {
                        $ionicLoading.show({template: 'Saving...',duration: 500});
                    });
                });

                var barangpenjualan = [];
                angular.forEach(datafromview,function(value,key)
                {
                    var datapenjualan       = {};
                    datapenjualan.id        = value.ID;
                    datapenjualan.ITEM_ID   = value.ITEM_ID;
                    datapenjualan.nama      = value.ITEM_NM;
                    datapenjualan.harga     = Number(value.ITEM_HARGA);
                    datapenjualan.maksimal  = value.qtychecked;
                    datapenjualan.gambar    = 'img/bika-ambon.jpg';
                    datapenjualan.formula   = value.formula;
                    barangpenjualan.push(datapenjualan);
                });
                StorageService.set('barangpenjualan',barangpenjualan);
            }
        });    
    }
});
