angular.module('starter')
.controller('CashierCtrl', function($scope,$filter,$state,$ionicLoading,$ionicModal,StorageService,ProductFac) 
{
    $scope.profile  = StorageService.get('profile');
    if($scope.profile.gambar == 'none')
    {
        $scope.profile.gambar = "img/customer.jpg";
    }
    else
    {
        $scope.profile.gambar = "data:image/png;base64," + $scope.profile.gambar;
    }
    var tglsekarang = $filter('date')(new Date(),'dd-MM-yyyy');
    var bookingtransaksi = StorageService.get('bookingtransaksi');

    if(bookingtransaksi)
    {
        $scope.transaks = bookingtransaksi
    }
    else
    {
        $scope.transaks = [];
    }


    $scope.gotoitem = function(item)
    {
        $state.go('tab.sales');
        StorageService.set('notransaksi',item.notransk);
    }
    
    $scope.tambahtransaksi = function()
    {   var data = {};
        var panjangtransaksi = $scope.transaks.length
        if( panjangtransaksi > 0)
        {
            var stringtransaksi = $scope.transaks[panjangtransaksi-1].notransk;
            var lastthree       = stringtransaksi.substr(stringtransaksi.length - 3); // => "Tabs1"
            data.notransk = 'LG-SR-KB-' + tglsekarang + '-00' + (Number(lastthree) + 1);
        }
        else
        {
            data.notransk = 'LG-SR-KB-' + tglsekarang + '-00' + ($scope.transaks.length + 1);
        }
        $scope.transaks.push(data);
        StorageService.set('bookingtransaksi',$scope.transaks);
    }

    

})

.controller('SalesCtrl', function($scope,$state,$ionicLoading,$ionicModal,UtilService,StorageService) 
{

    var array = 
    [
        {'id':1,'nama':'Risol A','harga':15000,'gambar':'img/risol.jpg','quantity':0,'maksimal':5},
        {'id':2,'nama':'Lapis A','harga':13000,'gambar':'img/lapis-legit.jpg','quantity':0,'maksimal':6},
        {'id':3,'nama':'Martabak A','harga':11000,'gambar':'img/martabak.JPG','quantity':0,'maksimal':7},
        {'id':4,'nama':'Bika A','harga':14000,'gambar':'img/bika-ambon.jpg','quantity':0,'maksimal':8},
        {'id':5,'nama':'Risol B','harga':12000,'gambar':'img/risol.jpg','quantity':0,'maksimal':9},
        {'id':6,'nama':'Lapis B','harga':12000,'gambar':'img/lapis-legit.jpg','quantity':0,'maksimal':0},
        {'id':7,'nama':'Martabak B','harga':12000,'gambar':'img/martabak.JPG','quantity':0,'maksimal':0},
        {'id':8,'nama':'Bika B','harga':12000,'gambar':'img/bika-ambon.jpg','quantity':0,'maksimal':0}
    ];


    $scope.noresi   = StorageService.get('notransaksi');
    var resi        = StorageService.get($scope.noresi);
    if(resi)
    {
        angular.forEach(resi,function(value,key)
        {
            var itemaddtocart = _.findIndex(array, {'id': value.id});
            if(itemaddtocart != -1)
            {
                array[itemaddtocart] = value;
            }
        });
    }
    else
    {
        resi = [];
    }
    $scope.banyakdicart = resi.length;
    $scope.datas = UtilService.ArrayChunk(array,4);
    $scope.AddToCart = function(item) 
    {

        if(item.quantity == 0 && item.maksimal != 0)
        {
            item.quantity = 1;
            item.maksimal = item.maksimal - 1;
        }
        $ionicModal.fromTemplateUrl('templates/sales/addtocartmodal.html', 
        {
            scope: $scope,
            animation: 'fade-in-scale'
        })
        .then(function(modal) 
        {
            $ionicLoading.show({template: 'Loading...',duration: 500});
            $scope.modal            = modal;
            $scope.modal.show();
            $scope.item = item;
        });  
    };

    $scope.closeModal = function() 
    {
        var itemaddtocart = _.findIndex(resi, {'id': $scope.item.id});
        if(itemaddtocart != -1)
        {
            if($scope.item.quantity > 0)
            {
                resi[itemaddtocart]     = $scope.item; 
            }
            else
            {
                resi.splice(itemaddtocart,1);
                $scope.banyakdicart  -= 1;
            }
        }
        else
        {
            if($scope.item.quantity > 0)
            {
                resi.push($scope.item);
                $scope.banyakdicart    += 1;  
            }
        }
        StorageService.set( $scope.noresi,resi);
        $scope.modal.remove();
    };

    $scope.incdec = function(data)
    {

        if(data == 'inc')
        {
            if($scope.item.maksimal == 0)
            {
                if($scope.item.quantity == 0)
                {
                    alert("Barang Tidak Tersedia");
                }
                else
                {
                    alert("Barang Hanya Tersedia: " + $scope.item.quantity + " Item");    
                }
                
            }
            else
            {
                $scope.item.quantity +=1;
                $scope.item.maksimal -=1;
            }
        }
        else if(data == 'dec')
        {
            if($scope.item.quantity == 0)
            {
                alert("Tidak Boleh");
            }
            else
            {
                $scope.item.quantity -=1;
                $scope.item.maksimal +=1;
            }
        }
    }
    $scope.clearquantity = function()
    {
        $scope.item.maksimal = $scope.item.maksimal + $scope.item.quantity;
        $scope.item.quantity = 0;
    }

    $scope.gotocart     = function()
    {
        if(resi.length > 0)
        {
            $state.go('tab.cart');
        }
        else
        {
            alert("Belum Ada Item Yang Dipilih");
        }
        
    } 
})

.controller('CartCtrl', function($scope,$state,$ionicLoading,$ionicModal,$ionicHistory,$ionicNavBarDelegate,UtilService,StorageService) 
{
    $scope.noresi   = StorageService.get('notransaksi');
    var resi        = StorageService.get($scope.noresi);
    $scope.datas    = resi;
    

    $scope.incdec = function(data,item)
    {
        if(data == 'inc')
        {
            if(item.maksimal == 0)
            {
                alert("Barang Hanya Tersedia: " + item.quantity + " Item");
            }
            else
            {
                item.quantity +=1;
                item.maksimal -=1;
            }
        }
        else if(data == 'dec')
        {
            if(item.quantity < 2)
            {
                var itemaddtocart = _.findIndex($scope.datas, {'id': item.id});
                $scope.datas.splice(itemaddtocart,1);
            }
            else
            {
               item.quantity -=1;
               item.maksimal +=1;
            }
        }
        $scope.total = UtilService.SumPriceWithQty($scope.datas,'harga','quantity');
        StorageService.set($scope.noresi,$scope.datas);
    }
    $scope.deleteone = function(item)
    {
        var itemaddtocart = _.findIndex($scope.datas, {'id': item.id});
        $scope.datas.splice(itemaddtocart,1);
        $scope.total = UtilService.SumPriceWithQty($scope.datas,'harga','quantity');
        StorageService.set($scope.noresi,$scope.datas);
    }
    $scope.total = UtilService.SumPriceWithQty($scope.datas,'harga','quantity');
    $scope.pembayaran = function(noresi)
    {
        alert("Belanjaan Anda Berhasil Diproses.Total Pembayaran = Rp. " + $scope.total);
        var bookingtransaksi        = StorageService.get('bookingtransaksi');
        var indexbookingtransaksi   = _.findIndex(bookingtransaksi, {'notransk': $scope.noresi});
        bookingtransaksi.splice(indexbookingtransaksi,1);
        StorageService.set('bookingtransaksi',bookingtransaksi);
        StorageService.destroy(noresi);
        StorageService.destroy('notransaksi');
        $ionicHistory.nextViewOptions({disableAnimate: true, disableBack: true});
        $state.go('tab.cashier');
    }
});
