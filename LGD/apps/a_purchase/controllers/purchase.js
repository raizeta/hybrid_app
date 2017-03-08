angular.module('starter')
 .controller('PurchaseCtrl', function($window,$timeout,$rootScope,$scope, $state,$ionicPopup,$ionicLoading,UtilService,StorageService,PurchaseFac) 
{

})
.controller('PurchaseInboxCtrl', function($window,$timeout,$rootScope,$scope,$state,$ionicPopup,$ionicLoading,$ionicModal,UtilService,StorageService,resPurchace,ArrayObjectService) 
{
    $scope.purchaselist = resPurchace;
    var spliceitem = StorageService.get('splice-item');
    var itemsplice = _.findIndex($scope.purchaselist, {KD_PO:spliceitem});
    if(itemsplice > -1)
    {
        $scope.purchaselist.splice(itemsplice,1); 
    }

    $scope.openModal = function(item) 
    {
        $ionicModal.fromTemplateUrl('apps/a_purchase/views/purchasemodal.html', 
        {
            scope: $scope
        })
        .then(function(modal) 
        {
            $scope.detailpurchase   = item;
            $scope.modal            = modal;
            $scope.modal.show();
        });
        
    };
    $scope.closeModal = function() 
    {
        $scope.modal.hide();
    };

})
.controller('PurchaseInboxDetailCtrl', function($window,$timeout,$rootScope,$stateParams,$scope,$state,$ionicPopup,$ionicLoading,UtilService,StorageService,PurchaseDetailFac,resPurchaceList,PurchaseFac) 
{
    var KD_PO = $stateParams.id;

    $scope.purchaselist     = resPurchaceList;
    $rootScope.total        = UtilService.SumPriceQtyWithCondition($scope.purchaselist,'HARGA','QTY','checked');

    $scope.toggleChange = function(item) 
    {
        if(item.checked)
        {
            $rootScope.total = $rootScope.total + (item.HARGA * item.QTY);
        }
        else
        {
          $rootScope.total = $rootScope.total - (item.HARGA * item.QTY);  
        }
        PurchaseDetailFac.UpdatePurchaseDetail(item)
        .then (function(response)
        {
            console.log("Purchase Berhasil Di Update");
        });
    };
    $scope.confirmasi = function(data)
    {
        var statusaprove        = data[0];
        var purchase            = data[1].KD_PO;
        if(statusaprove === 'aprove')
        {
            if($scope.total == 0)
            {
                alert("PO Tidak Bisa Di Aprove.Minimal Satu Item Harus Di Aprove");
            }
            else
            {
                var confirmPopup = $ionicPopup.confirm
                ({
                    title: 'Aprove',
                    template: 'Are You Sure To Aprove This PO?',
                    cancelText:'Cancel',
                    cancelType:'button-assertive',
                });

                confirmPopup.then(function(res) 
                {
                    if(res) 
                    {
                        PurchaseFac.UpdatePurchase(purchase,statusaprove)
                        .then (function (response)
                        {
                            $state.go('main.po.inbox');
                            StorageService.set('splice-item',purchase);
                        });
                        
                    } 
               });
            }  
        }
        else
        {
            var confirmPopup = $ionicPopup.confirm
            ({
                title: 'Reject',
                template: 'Are You Sure To Reject This PO?',
                cancelText:'Cancel',
                cancelType:'button-assertive',
            });

            confirmPopup.then(function(res)
            {
                if(res) 
                {
                    PurchaseFac.UpdatePurchase(purchase,statusaprove)
                    .then (function (response)
                    {
                        $state.go('main.po.inbox');
                        StorageService.set('splice-item',purchase);
                    });
                }
            });  
        }
    }
})
.controller('PurchaseAcceptCtrl', function($window,$timeout,$rootScope,$scope, $state,$ionicPopup,$ionicLoading,$ionicModal,resPurchace) 
{
	$scope.purchaselist = resPurchace;

    $scope.openModal = function(item) 
    {
        $ionicModal.fromTemplateUrl('apps/a_purchase/views/purchasemodal.html', 
        {
            scope: $scope
        })
        .then(function(modal) 
        {
            $scope.detailpurchase   = item;
            $scope.modal            = modal;
            $scope.modal.show();
        });
        
    };
    $scope.closeModal = function() 
    {
        $scope.modal.hide();
    };
})
.controller('PurchaseAcceptDetailCtrl', function($window,$timeout,$rootScope,$scope, $state,$ionicPopup,$ionicLoading,UtilService,resPurchaceList) 
{
    $scope.purchaselist     = resPurchaceList;
    $rootScope.total        = UtilService.SumPriceQtyWithCondition($scope.purchaselist,'HARGA','QTY','checked');
    $rootScope.totalall     = UtilService.SumPriceWithQty($scope.purchaselist,'HARGA','QTY');
})
.controller('PurchaseRejectCtrl', function($window,$timeout,$rootScope,$scope, $state,$ionicPopup,$ionicLoading,$ionicModal,StorageService,resPurchace) 
{
	$scope.purchaselist = resPurchace;

    $scope.openModal = function(item) 
    {
        $ionicModal.fromTemplateUrl('apps/a_purchase/views/purchasemodal.html', 
        {
            scope: $scope
        })
        .then(function(modal) 
        {
            $scope.detailpurchase   = item;
            $scope.modal            = modal;
            $scope.modal.show();
        }); 
    };
    $scope.closeModal = function() 
    {
        $scope.modal.hide();
    };
})
.controller('PurchaseRejectDetailCtrl', function($window,$rootScope,$scope,UtilService,resPurchaceList) 
{
    $scope.purchaselist     = resPurchaceList;
    $rootScope.total        = UtilService.SumPriceQtyWithCondition($scope.purchaselist,'HARGA','QTY','checked');
    $rootScope.totalall     = UtilService.SumPriceWithQty($scope.purchaselist,'HARGA','QTY');
})

.controller('PurchaseProgressCtrl', function($window,$timeout,$rootScope,$scope, $state,$ionicPopup,$ionicLoading,$ionicModal,StorageService,resPurchace) 
{
    $scope.purchaselist = resPurchace;

    $scope.openModal = function(item) 
    {
        $ionicModal.fromTemplateUrl('apps/a_purchase/views/purchasemodal.html', 
        {
            scope: $scope
        })
        .then(function(modal) 
        {
            $scope.detailpurchase   = item;
            $scope.modal            = modal;
            $scope.modal.show();
        }); 
    };
    $scope.closeModal = function() 
    {
        $scope.modal.hide();
    };
})
.controller('PurchaseProgressDetailCtrl', function($window,$rootScope,$scope,UtilService,resPurchaceList) 
{
    $scope.purchaselist     = resPurchaceList;
    $rootScope.total        = UtilService.SumPriceQtyWithCondition($scope.purchaselist,'HARGA','QTY','checked');
    $rootScope.totalall     = UtilService.SumPriceWithQty($scope.purchaselist,'HARGA','QTY');
});