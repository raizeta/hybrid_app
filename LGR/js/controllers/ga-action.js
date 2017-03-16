angular.module('starter')
.controller('GaInventoryCtrl', 
function($scope,$ionicLoading,$filter,$ionicPopup,$ionicModal,UtilService,StorageService,StoreCombFac,TransaksiHeaderFac,TransaksiFac,ProductFac) 
{
    $scope.tglsekarang      = $filter('date')(new Date(),'dd-MM-yyyy');
    var kemarin     = new Date();
    kemarin.setDate(kemarin.getDate() - 1);

    $ionicLoading.show
    ({
      template: 'Loading...'
    })
    .then(function()
    {
        StoreCombFac.GetPureStoreComb()
        .then(function(response)
        {
            $scope.stores = response;
        },
        function(error)
        {
            console.log(error)
        })
        .finally(function()
        {
            $ionicLoading.show({template: 'Loading...',duration: 500});
        });
    });
    
    $scope.selecttoko = function(item)
    {
        if(item)
        {
            $scope.tglinv   = $filter('date')(new Date(),'yyyy-MM-dd');
            $ionicLoading.show
            ({
              template: 'Loading...'
            })
            .then(function()
            {
            	TransaksiFac.GetTransaksis(item.OUTLET_BARCODE,$scope.tglinv,1)
                .then(function(response)
                {
                    if(response.length > 0)
                    {
                        console.log(response);
                        $scope.showbelumbooking = false;
                        $scope.datas = [];
                        angular.forEach(response,function(value,key)
                        {
                            value.belanja = value.ITEM_QTY;
                            $scope.datas.push(value);
                        });  
                    }
                    else
                    {
                        $scope.showbelumbooking = true;
                        ProductFac.GetProducts(item.OUTLET_BARCODE)
                        .then(function(response)
                        {
                            $scope.datas = [];
                            angular.forEach(response,function(value,key)
                            {
                                var data = {};
                                data.belanja           = 0;
                                data.CREATE_BY         = $scope.profile.id;
                                data.ITEM_ID           = value.ITEM_BARCODE;
                                data.ITEM_NM           = value.ItemNm;
                                data.ITEM_QTY          = 0;
                                data.OUTLET_ID         = value.OUTLET_ID;
                                data.OUTLET_NM         = value.StoreNm;
                                data.TRANS_TYPE        = 1;
                                data.UPDATE_BY         = $scope.profile.id;
                                data.USER_ID           = $scope.profile.id;
                                $scope.datas.push(data);
                            });
                            console.log($scope.datas);
                        },
                        function(error)
                        {
                            console.log(error);
                        }).
                        finally(function()
                        {

                        });
                    }
                    
                },
                function(err)
                {
                    console.log(err);
                })
                .finally(function()
                {
                    $ionicLoading.show({template: 'Loading...',duration: 500});
                });
            });
        }
        else
        {
            $scope.datas = [];  
        }
    }

    $scope.incdec = function(incordec,items)
    {
        if(incordec == 'inc')
        {
            items.belanja += 1;
        }
        else if(incordec == 'dec')
        {
            items.belanja -= 1;
        }
    }

    $scope.submitinventory = function(datafromview)
    {
        var confirmPopup = $ionicPopup.confirm(
        {
            title: 'Submit Buy',
            template: 'Are you sure to submit this buy to Server?'
        });
        confirmPopup.then(function(res) 
        {
            if(res) 
            {
                var datadetail  = angular.copy(datafromview);
                var dataheader  = {'OUTLET_ID':datadetail[0].OUTLET_ID,'TRANS_TYPE':2};
                $ionicLoading.show
                ({
                    template: 'Booking...'
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
                            $scope.errordata = [];
                            angular.forEach(datadetail,function(value,key)
                            {
                                value.ITEM_QTY          = value.belanja;
                                value.TRANS_ID          = responseserver.TRANS_ID;
                                value.TRANS_TYPE        = 2;
                                value.USER_ID           = $scope.profile.id;
                                value.CREATE_BY         = $scope.profile.id;
                                value.CREATE_AT         = $filter('date')(new Date(),'yyyy-MM-dd H:m:s');
                                
                                TransaksiFac.SetTranskasi(value)
                                .then(function(response)
                                {
                                    console.log(response)
                                },
                                function(error)
                                {
                                    console.log(error);
                                    $scope.errordata.push(value);
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
                        $ionicLoading.show({template: 'Save...',duration: 500});
                        if($scope.errordata.length > 0)
                        {
                            alert("Data Gagal Disimpan Dengan Sempurna.Silahkan Ulangi Lagi");
                        }
                        else
                        {
                            alert("Data Berhasil Disimpan Dengan Sempurna");
                        }
                    });
                });
            }
        });
    }
});
