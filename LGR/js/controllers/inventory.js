angular.module('starter')
.controller('InventoryCtrl', function($scope,$ionicLoading,$filter,$ionicModal,UtilService,StorageService,ProductFac,TransaksiFac) 
{
	$scope.tglsekarang  = $filter('date')(new Date(),'yyyy-MM-dd');
    var kemarin     = new Date();
    kemarin.setDate(kemarin.getDate() - 1);
    
    $scope.profile      = StorageService.get('profile');
    var invstatus       = StorageService.get('InventoryStatus');
    if(invstatus)
    {
        if((invstatus.tanggalcheck == $scope.tglsekarang) && (invstatus.statuscheck     == 'CHECKED'))
        {
           $scope.typeinv = 3;
           $scope.tglinv  = $scope.tglsekarang; 
        }
        else
        {
            $scope.typeinv  = 2;
            $scope.tglinv   = $filter('date')(kemarin,'yyyy-MM-dd');
        }
    }
    else
    {
        $scope.typeinv = 2;
        $scope.tglinv   = $filter('date')(kemarin,'yyyy-MM-dd');
    }
    var lokasistore     = StorageService.get('LokasiStore');
	TransaksiFac.GetTransaksis(lokasistore.OUTLET_BARCODE,$scope.tglinv,$scope.typeinv)
    .then(function(response)
    {
        $scope.datas = [];
        angular.forEach(response,function(value,key)
        {
            value.qtychecked = value.ITEM_QTY;
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
    var localbarangpenjualan = StorageService.get('barangpenjualan');
    if(!localbarangpenjualan)
    {
        var array = 
        [
            {'id':1,'nama':'Risol A','harga':15000,'gambar':'img/risol.jpg','maksimal':5},
            {'id':2,'nama':'Lapis A','harga':13000,'gambar':'img/lapis-legit.jpg','maksimal':6},
            {'id':3,'nama':'Martabak A','harga':11000,'gambar':'img/martabak.JPG','maksimal':7},
            {'id':4,'nama':'Bika A','harga':14000,'gambar':'img/bika-ambon.jpg','maksimal':8},
            {'id':5,'nama':'Risol B','harga':12000,'gambar':'img/risol.jpg','maksimal':9},
            {'id':6,'nama':'Lapis B','harga':12000,'gambar':'img/lapis-legit.jpg','maksimal':0},
            {'id':7,'nama':'Martabak B','harga':12000,'gambar':'img/martabak.JPG','maksimal':0},
            {'id':8,'nama':'Bika B','harga':12000,'gambar':'img/bika-ambon.jpg','maksimal':0}
        ];
        StorageService.set('barangpenjualan',array);   
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

    $scope.rechecked = function(items)
    {
        var indexarrayasli = _.findIndex($scope.datas, {'ITEM_ID': items.ITEM_ID});
        if($scope.typeinv == 2)
        {
            $scope.datas[indexarrayasli].statuschecked = 'sudah-di-check';
        }
        else
        {
           $scope.datas[indexarrayasli].statuschecked = 'belum-di-check'; 
        }
    }
    
    $scope.submitinventory = function(datas)
    {

        angular.forEach(datas,function(value,key)
        {
            value.ITEM_QTY          = value.qtychecked;
            value.TYPE              = 'RCVD';
            value.TRANS_TYPE        = 3;
            value.USER_ID           = $scope.profile.id;
            value.CREATE_BY         = $scope.profile.id;
            value.CREATE_AT         = $filter('date')(new Date(),'yyyy-MM-dd H:m:s')
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
