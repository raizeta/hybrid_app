angular.module('starter')
.factory('ShopCartLiteFac',function($rootScope,$http, $q, $filter, $window,$cordovaSQLite,UtilService)
{
    var SetShopCart = function (datatosave)
    {
        var deferred            = $q.defer();
        var TGL_ADDTOCART       = $filter('date')(new Date(),'yyyy-MM-dd');
        var DATETIME_ADDTOCART  = $filter('date')(new Date(),'yyyy-MM-dd HH:mm:ss');
        var NOMOR_TRANS         = datatosave.NOMOR_TRANS;
        var ITEM_ID             = datatosave.ITEM_ID;
        var ITEM_NM             = datatosave.ITEM_NM;
        var ITEM_HARGA          = datatosave.ITEM_HARGA;
        var QTY_INCART          = datatosave.QTY_INCART;
        var DISCOUNT            = datatosave.DISCOUNT;
        var SATUAN              = datatosave.SATUAN;
        var IS_ONSERVER         = datatosave.IS_ONSERVER;
        var isitable            = [TGL_ADDTOCART,DATETIME_ADDTOCART,NOMOR_TRANS,ITEM_ID,ITEM_NM,ITEM_HARGA,QTY_INCART,DISCOUNT,SATUAN,IS_ONSERVER];
        var queryinsertshopcart = 'INSERT INTO Tbl_ShopCart (TGL_ADDTOCART,DATETIME_ADDTOCART,NOMOR_TRANS,ITEM_ID,ITEM_NM,ITEM_HARGA,QTY_INCART,DISCOUNT,SATUAN,IS_ONSERVER) VALUES (?,?,?,?,?,?,?,?,?,?)';
        $cordovaSQLite.execute($rootScope.db,queryinsertshopcart,isitable)
        .then(function(result) 
        {
            deferred.resolve(result);
        },
        function (error)
        {
            deferred.reject(error);
        });
        return deferred.promise; 
    }

    var UpdateShopCartQty = function (datatosave)
    {
        var deferred            = $q.defer();
        var NOMOR_TRANS         = datatosave.NOMOR_TRANS;
        var ITEM_ID             = datatosave.ITEM_ID;
        var QTY_INCART          = datatosave.QTY_INCART;

        var isitable            = [QTY_INCART,NOMOR_TRANS,ITEM_ID];
        var queryinsertshopcart  = 'UPDATE Tbl_ShopCart SET QTY_INCART = ? WHERE NOMOR_TRANS = ? AND ITEM_ID =?';
        $cordovaSQLite.execute($rootScope.db,queryinsertshopcart,isitable)
        .then(function(result) 
        {
            deferred.resolve(result);
        },
        function (error)
        {
            deferred.reject(error);
        });
        return deferred.promise; 
    }

    var UpdateIsOnServer = function (datatosave)
    {
        var deferred            = $q.defer();
        var NOMOR_TRANS         = datatosave.NOMOR_TRANS;
        var ITEM_ID             = datatosave.ITEM_ID;
        var IS_ONSERVER         = 1;

        var isitable            = [IS_ONSERVER,NOMOR_TRANS,ITEM_ID];
        console.log(isitable);
        var updateisonserver    = 'UPDATE Tbl_ShopCart SET IS_ONSERVER = ? WHERE NOMOR_TRANS = ? AND ITEM_ID =?';
        $cordovaSQLite.execute($rootScope.db,updateisonserver,isitable)
        .then(function(result) 
        {
            deferred.resolve(result);
        },
        function (error)
        {
            deferred.reject(error);
        });
        return deferred.promise; 
    }

    var DeleteShopCartByNoTransAndItemId = function (datatosave)
    {
        var deferred            = $q.defer();
        var NOMOR_TRANS         = datatosave.NOMOR_TRANS;
        var ITEM_ID             = datatosave.ITEM_ID;
        var isitable            = [NOMOR_TRANS,ITEM_ID];
        var queryinsertshopcart  = 'DELETE FROM Tbl_ShopCart WHERE NOMOR_TRANS = ? AND ITEM_ID =?';
        $cordovaSQLite.execute($rootScope.db,queryinsertshopcart,isitable)
        .then(function(result) 
        {
            deferred.resolve(result);
        },
        function (error)
        {
            deferred.reject(error);
        });
        return deferred.promise; 
    }
    
    var GetShopCartByNomorTrans = function (NOMOR_TRANS)
    {
        var deferred = $q.defer();
        var queryselectstore = 'SELECT * FROM Tbl_ShopCart WHERE NOMOR_TRANS = ?';
        $cordovaSQLite.execute($rootScope.db, queryselectstore,[NOMOR_TRANS])
        .then(function(result) 
        {
            if(result.rows.length > 0)
            {
                var response = UtilService.SqliteToArray(result);
                deferred.resolve(response);
            }
            else
            {
                deferred.resolve([]);
            }
        },
        function (error)
        {
            deferred.reject(error); 
        });
        return deferred.promise; 
    }
    
    var GetShopCartByItemAndNoTrans = function (ITEM_ID,NOMOR_TRANS)
    {
        var deferred = $q.defer();
        var queryselectstore = 'SELECT * FROM Tbl_ShopCart WHERE ITEM_ID = ? AND NOMOR_TRANS = ?';
        $cordovaSQLite.execute($rootScope.db, queryselectstore,[ITEM_ID,NOMOR_TRANS])
        .then(function(result) 
        {
            if(result.rows.length > 0)
            {
                var response = UtilService.SqliteToArray(result);
                deferred.resolve(response);
            }
            else
            {
                deferred.resolve([]);
            }
        },
        function (error)
        {
            deferred.reject(error); 
        });
        return deferred.promise; 
    }

    return{
            SetShopCart:SetShopCart,
            UpdateShopCartQty:UpdateShopCartQty,
            DeleteShopCartByNoTransAndItemId:DeleteShopCartByNoTransAndItemId,
            UpdateIsOnServer:UpdateIsOnServer,
            GetShopCartByNomorTrans:GetShopCartByNomorTrans,
            GetShopCartByItemAndNoTrans:GetShopCartByItemAndNoTrans
        }
});