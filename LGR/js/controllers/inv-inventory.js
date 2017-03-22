angular.module('starter')
.controller('InventoryCtrl', function($scope,$ionicLoading,$filter,$ionicPopup,$ionicModal,UtilService,StorageService,InvCheckLiteFac,BarangForSaleLiteFac,ProductCombFac,ProductFac,TransaksiHeaderFac,TransaksiFac) 
{
	$scope.tglsekarang  = $filter('date')(new Date(),'yyyy-MM-dd');
    var lokasistore     = StorageService.get('LokasiStore');
    $scope.profile      = StorageService.get('profile');


    var productserver = null;
    ProductCombFac.GetPureProductGroupComb(lokasistore.OUTLET_BARCODE)
    .then(function(response)
    {
        productserver = response;
    });

    InvCheckLiteFac.GetInvChecks($scope.tglsekarang,'RECEIVED')
    .then(function(response)
    {
        console.log(response);
        if(angular.isArray(response) && response.length > 0)
        {
            $scope.typeinv  = 2;
            TransaksiFac.GetTransaksis(lokasistore.OUTLET_BARCODE,$scope.tglsekarang,$scope.typeinv)
            .then(function(response)
            {
                $scope.datas = [];
                angular.forEach(response,function(value,key)
                {
                    var indexproductserver  =  _.findIndex(productserver, {'ITEM_BARCODE': value.ITEM_ID});
                    value.qtychecked        = value.ITEM_QTY;
                    value.formula           = productserver[indexproductserver].formula;
                    $scope.datas.push(value);
                });
            },
            function(err)
            {
                console.log(err);
            });
        }
        else
        {
            $scope.typeinv  = 2;
            TransaksiFac.GetTransaksis(lokasistore.OUTLET_BARCODE,$scope.tglsekarang,$scope.typeinv)
            .then(function(response)
            {
                $scope.datas = [];
                angular.forEach(response,function(value,key)
                {
                    var indexproductserver  =  _.findIndex(productserver, {'ITEM_BARCODE': value.ITEM_ID});
                    value.qtychecked        = value.ITEM_QTY;
                    $scope.datas.push(value);
                });
            },
            function(err)
            {
                console.log(err);
            }); 
        }
    },
    function(error)
    {
        console.log(error);
    });

    
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
                var datainvstatus = {};
                datainvstatus.TGL_CHECK         = $filter('date')(new Date(),'yyyy-MM-dd');
                datainvstatus.DATETIME_CHECK    = $filter('date')(new Date(),'yyyy-MM-dd HH:mm:ss');
                datainvstatus.NAMA_INV          = 'RECEIVED';
                datainvstatus.STATUS_CHECK      = 'COMPLETE';

                InvCheckLiteFac.SetInvChecks(datainvstatus)
                .then(function(response)
                {
                    // console.log(response);
                });

                var datadetail = angular.copy(datafromview);
                var dataheader  = {'OUTLET_ID':lokasistore.OUTLET_BARCODE,'TRANS_TYPE':3};
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
                                    console.log(response);
                                },
                                function(error)
                                {
                                    console.log(error);
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

                angular.forEach(datafromview,function(value,key)
                {
                    var databarangpenjualan             = {};
                    databarangpenjualan.TGL_SAVE        = $filter('date')(new Date(),'yyyy-MM-dd')
                    databarangpenjualan.ITEM_ID         = value.ITEM_ID;
                    databarangpenjualan.ITEM_NM         = value.ITEM_NM;
                    databarangpenjualan.ITEM_HARGA      = Number(value.ITEM_HARGA);
                    databarangpenjualan.STOCK_MAX       = value.qtychecked;
                    databarangpenjualan.GAMBAR          = 'img/bika-ambon.jpg';
                    databarangpenjualan.FORMULA         = value.formula;
                    BarangForSaleLiteFac.SetBarangForSale(databarangpenjualan)
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
        });    
    }
});
