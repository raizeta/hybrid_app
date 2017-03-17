angular.module('starter')
.controller('InventoryCtrl', function($scope,$ionicLoading,$filter,$ionicModal,UtilService,StorageService,ProductFac,TransaksiFac) 
{
	$scope.tglsekarang  = $filter('date')(new Date(),'yyyy-MM-dd');
    var kemarin     = new Date();
    kemarin.setDate(kemarin.getDate() - 1);
    var lokasistore     = StorageService.get('LokasiStore');
    $scope.profile      = StorageService.get('profile');
    var invstatus       = StorageService.get('InventoryStatus');

    $scope.gettransaksi = function()
    {
        TransaksiFac.GetTransaksis(lokasistore.OUTLET_BARCODE,$scope.tglinv,$scope.typeinv)
        .then(function(response)
        {
            $scope.datas = [];
            angular.forEach(response,function(value,key)
            {
                value.qtychecked = value.ITEM_QTY;
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
            $scope.typeinv  = 2;
            $scope.tglinv   = $filter('date')(kemarin,'yyyy-MM-dd');
            $scope.gettransaksi();
        }
    }
    else
    {
        $scope.typeinv = 2;
        $scope.tglinv   = $filter('date')(kemarin,'yyyy-MM-dd');
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
        var datas = angular.copy(datafromview);
        StorageService.set('BrgPenjualan',datas);
        angular.forEach(datas,function(value,key)
        {
            value.ITEM_QTY          = value.qtychecked;
            value.TYPE              = 'RCVD';
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

        var barangpenjualan = [];
        angular.forEach(datafromview,function(value,key)
        {
            var datapenjualan       = {};
            datapenjualan.id        = value.ID;
            datapenjualan.nama      = value.ITEM_NM;
            datapenjualan.harga     = Number(value.ITEM_HARGA);
            datapenjualan.maksimal  = value.qtychecked;
            datapenjualan.gambar    = 'img/bika-ambon.jpg';
            barangpenjualan.push(datapenjualan);
        });
        StorageService.set('barangpenjualan',barangpenjualan);
         
    }
})

.controller('BookingCtrl', function($scope,$ionicLoading,$filter,$ionicModal,UtilService,StorageService,ProductFac) 
{
    $scope.tglsekarang = $filter('date')(new Date(),'dd-MM-yyyy');
    ProductFac.GetProducts()
    .then(function(response)
    {
        console.log(response);
        $scope.datas = response;
    },
    function(err)
    {
        console.log(err);
    })
    .finally(function()
    {

    });
});
