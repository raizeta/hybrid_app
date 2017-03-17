angular.module('starter')
.controller('CashierCtrl', function($scope,$filter,$state,$ionicLoading,$ionicPopup,$ionicModal,UtilService,StorageService,TransCustLiteFac) 
{
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

    TransCustLiteFac.GetTransCustsByDateStatus(tglsekarang,'INCOMPLETE')
    .then(function(response)
    {
        $scope.transaks = response;
    });

    $scope.gotoitem = function(item)
    {
        StorageService.set('TRANS-ACTIVE',item.MOMOR_TRANS);
        $state.go('tab.sales');
    }
    
    $scope.tambahtransaksi = function()
    {   var localbarangpenjualan = StorageService.get('barangpenjualan');
        if(localbarangpenjualan)
        {
            TransCustLiteFac.GetTransCustsByDate(tglsekarang)
            .then(function(responselite)
            {
                var datacustrans = {};
                if(responselite.length > 0)
                {
                    var lastbookingserialnumber     = responselite[responselite.length - 1].MOMOR_TRANS;
                    var lastthree                   = lastbookingserialnumber.substr(lastbookingserialnumber.length - 3);
                    var nomorurut                   = UtilService.StringPad(Number(lastthree) + 1,'000');
                    datacustrans.TGL_TRANS          = $filter('date')(new Date(),'dd-MM-yyyy');
                    datacustrans.DATETIME_TRANS     = $filter('date')(new Date(),'dd-MM-yyyy HH:mm:ss');
                    datacustrans.MOMOR_TRANS        = 'LG.RS.KB.' + $filter('date')(new Date(),'dd.MM.yyyy') + '.' + nomorurut;
                    datacustrans.STATUS_BUY         = 'INCOMPLETE';
                }
                else
                {
                    datacustrans.TGL_TRANS          = $filter('date')(new Date(),'dd-MM-yyyy');
                    datacustrans.DATETIME_TRANS     = $filter('date')(new Date(),'dd-MM-yyyy HH:mm:ss');
                    datacustrans.MOMOR_TRANS        = 'LG.SR.KB.' + $filter('date')(new Date(),'dd.MM.yyyy') + '.001';
                    datacustrans.STATUS_BUY         = 'INCOMPLETE';
                }

                TransCustLiteFac.SetTransCusts(datacustrans)
                .then(function(response)
                {
                    $scope.transaks.push(datacustrans);
                });
            });
            
        }
        else
        {
            alert("Anda Belum Melakukan Inventory Penjualan.Silahkan Lakukan Inventory Terlebih Dahulu!");
        }
    }

})

.controller('SalesCtrl', function($scope,$state,$ionicLoading,$ionicPopup,$ionicModal,UtilService,StorageService) 
{
    var arrayasli   = StorageService.get('barangpenjualan');
    var array       = angular.copy(arrayasli);
    $scope.noresi   = StorageService.get('TRANS-ACTIVE');
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
            animation: 'fade-in-scale',
            backdropClickToClose: false,
            hardwareBackButtonClose: false
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

.controller('CartCtrl', function($scope,$state,$ionicLoading,$ionicPopup,$ionicModal,$ionicHistory,$ionicNavBarDelegate,TransCustLiteFac,UtilService,StorageService) 
{
    $scope.noresi   = StorageService.get('TRANS-ACTIVE');
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
                TransCustLiteFac.UpdateTransCusts(['COMPLETE',$scope.noresi])
                .then(function(response)
                {
                    StorageService.destroy('TRANS-ACTIVE');
                    $ionicHistory.nextViewOptions({disableAnimate: true, disableBack: true});
                    $state.go('tab.cashier');
                },
                function(error)
                {
                    console.log(error);
                });

            } 
        });
    }
});
