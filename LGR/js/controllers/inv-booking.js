angular.module('starter')
.controller('BookingCtrl', function($scope,$ionicLoading,$filter,$ionicModal,UtilService,StorageService,TransaksiFac,ProductFac) 
{
    $scope.tglsekarang      = $filter('date')(new Date(),'dd-MM-yyyy');
    var lokasistore         = StorageService.get('LokasiStore');
    var brgpenjualanasli    = StorageService.get('BrgPenjualan');
    var brgpenjualanstore   = StorageService.get('barangpenjualan');
    if(brgpenjualanasli && brgpenjualanstore)
    {
       angular.forEach(brgpenjualanstore,function(value,key)
        {
            var indexproduct = _.findIndex(brgpenjualanasli, {'ID': value.id});
            brgpenjualanasli[indexproduct].sellout = brgpenjualanasli[indexproduct].qtychecked - value.maksimal;
            brgpenjualanasli[indexproduct].qtybooking = 0;
        });
        $scope.datas = brgpenjualanasli; 
    }
    else
    {
        ProductFac.GetProducts(lokasistore.OUTLET_BARCODE)
        .then(function(response)
        {
            console.log(response);
            $scope.datas = [];
            angular.forEach(response,function(value,key)
            {
                var data = {};
                data.ITEM_ID        = value.ITEM_BARCODE;
                data.ITEM_NM        = value.ItemNm;
                data.OUTLET_ID      = value.OUTLET_ID;
                data.OUTLET_NM      = value.StoreNm;
                data.ITEM_QTY       = 0;
                data.qtybooking     = 0;
                data.qtychecked     = 0;
                data.sellout        = 0
                $scope.datas.push(data);
            });
        },
        function(error)
        {

        })
        .finally(function()
        {

        });
    }
    
    $scope.incdec = function(incordec,items,valueincdec)
    {
        if(incordec == 'inc')
        {
            items.qtybooking += valueincdec;
        }
        else if(incordec == 'dec')
        {
           var qtybookingcopy           = angular.copy(items);
           qtybookingcopy.qtybooking   -= valueincdec;
           if(qtybookingcopy.qtybooking >= 0)
           {
                items.qtybooking   -= valueincdec;
           }
        } 
    }
    $scope.submitbooking    = function(datafromview)
    {
        var datas = angular.copy(datafromview);
        angular.forEach(datas,function(value,key)
        {
            value.ITEM_QTY          = value.qtybooking;
            value.TYPE              = 'BOOKING';
            value.TRANS_TYPE        = 1;
            value.TRANS_DATE        = $filter('date')(new Date(),'yyyy-MM-dd H:m:s');
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
            })
            .finally(function()
            {

            });

        });    
    }
});
