angular.module('starter')
.controller('CashierCtrl', function($scope,$filter,$state,$ionicLoading,$ionicPopup,$ionicModal,StorageService,ProductFac,ProductCombFac) 
{
    ProductCombFac.GetPureProductComb()
    .then(function(response)
    {
        console.log(response);
    },
    function(error)
    {
        console.log(error);
    });
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
    {   var localbarangpenjualan = StorageService.get('barangpenjualan');
        if(localbarangpenjualan)
        {
            var data = {};
            var lastbooking = StorageService.get('LastBooking');
            if(lastbooking)
            {
                if(lastbooking.tglbooking == tglsekarang)
                {
                    var lastbookingserialnumber = lastbooking.databooking;
                    var lastthree = lastbookingserialnumber.substr(lastbookingserialnumber.length - 3); // => "Tabs1"
                    data.notransk = 'LG-SR-KB-' + tglsekarang + '-00' + (Number(lastthree) + 1);
                    data.status   ='incomplete';  
                }
                else
                {
                    data.notransk = 'LG-SR-KB-' + tglsekarang + '-001';
                    data.status   ='incomplete';  
                } 
            }
            else
            {
                data.notransk = 'LG-SR-KB-' + tglsekarang + '-001';
                data.status   ='incomplete';
            }

            $scope.transaks.push(data);
            StorageService.set('bookingtransaksi',$scope.transaks);
            StorageService.set('LastBooking',{'databooking':data.notransk,'tglbooking':tglsekarang});
            $scope.statusincomplete = 1;
        }
        else
        {
            alert("Anda Belum Melakukan Inventory Penjualan.Silahkan Lakukan Inventory Terlebih Dahulu!");
        }
    }
    $scope.statusincomplete = _.findIndex($scope.transaks, {'status': 'incomplete'});
    console.log($filter('currency')(12000));
})

.controller('SalesCtrl', function($scope,$state,$ionicLoading,$ionicPopup,$ionicModal,UtilService,StorageService) 
{
    var arrayasli   = StorageService.get('barangpenjualan');
    var array       = angular.copy(arrayasli);
    $scope.noresi   = StorageService.get('notransaksi');
    var resi        = StorageService.get($scope.noresi);
    angular.forEach(array,function(value,key)
    {
        value.quantity = 0;
    });
    if(resi)
    {
        angular.forEach(resi,function(value,key)
        {
            var itemaddtocart = _.findIndex(array, {'id': value.id});
            if(itemaddtocart != -1)
            {
                array[itemaddtocart].quantity = value.quantity;
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
        var indexarrayasli = _.findIndex(arrayasli, {'id': item.id});
        if(item.quantity == 0 && item.maksimal != 0)
        {
            item.quantity = 1;
            item.maksimal = item.maksimal - 1;
            arrayasli[indexarrayasli].maksimal = arrayasli[indexarrayasli].maksimal - 1;
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
            StorageService.set('barangpenjualan',arrayasli);
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
        var indexarrayasli = _.findIndex(arrayasli, {'id': $scope.item.id});
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
                arrayasli[indexarrayasli].maksimal = arrayasli[indexarrayasli].maksimal - 1;
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
                arrayasli[indexarrayasli].maksimal = arrayasli[indexarrayasli].maksimal + 1;
            }
        }
        StorageService.set('barangpenjualan',arrayasli);
    }

    $scope.clearquantity = function()
    {
        $scope.item.maksimal = $scope.item.maksimal + $scope.item.quantity;
        var indexarrayasli = _.findIndex(arrayasli, {'id': $scope.item.id});
        arrayasli[indexarrayasli].maksimal = $scope.item.maksimal;
        StorageService.set('barangpenjualan',arrayasli);
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

.controller('CartCtrl', function($scope,$state,$ionicLoading,$ionicPopup,$ionicModal,$ionicHistory,$ionicNavBarDelegate,UtilService,StorageService) 
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

        var confirmPopup = $ionicPopup.confirm(
                                {
                                    title: 'Pembayaran',
                                    template: 'Are you sure to pay this cart?'
                                });
        confirmPopup.then(function(res) 
        {
            if(res) 
            {
                var bookingtransaksi        = StorageService.get('bookingtransaksi');
                var indexbookingtransaksi   = _.findIndex(bookingtransaksi, {'notransk': $scope.noresi});
                bookingtransaksi[indexbookingtransaksi].status = 'complete';
                StorageService.set('bookingtransaksi',bookingtransaksi);
                StorageService.destroy('notransaksi');
                $ionicHistory.nextViewOptions({disableAnimate: true, disableBack: true});
                $state.go('tab.cashier');
            } 
        });

    }
});
