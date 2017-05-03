angular.module('starter')
.factory('MerchantLiteFac',function($rootScope,$http, $q, $filter, $window,$cordovaSQLite,UtilService)
{
    var GetMerchant = function (OUTLET_CODE,STATUS_DISPLAY)
    {
        var deferred = $q.defer();
        var queryselectstore = 'SELECT * FROM Tbl_Merchant WHERE OUTLET_CODE = ? AND STATUS_DISPLAY = ?';
        $cordovaSQLite.execute($rootScope.db, queryselectstore,[OUTLET_CODE,STATUS_DISPLAY])
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
    
    var SetMerchant = function (datatosave)
    {
        var deferred        = $q.defer();
        var TGL_SAVE        = datatosave.TGL_SAVE;
        var OUTLET_CODE     = datatosave.OUTLET_CODE;
        var MERCHANT_NO     = datatosave.MERCHANT_NO;
        var MERCHANT_NM     = datatosave.MERCHANT_NM;
        var MERCHANT_OWNER  = datatosave.MERCHANT_OWNER;
        var STATUS_DISPLAY  = datatosave.STATUS_DISPLAY;
        var IS_ONSERVER     = datatosave.IS_ONSERVER;

        var isitable            = [TGL_SAVE,OUTLET_CODE,MERCHANT_NO,MERCHANT_NM,MERCHANT_OWNER,STATUS_DISPLAY,IS_ONSERVER]
        var queryinsertstore    = 'INSERT INTO Tbl_Merchant (TGL_SAVE,OUTLET_CODE,MERCHANT_NO,MERCHANT_NM,MERCHANT_OWNER,STATUS_DISPLAY,IS_ONSERVER) VALUES (?,?,?,?,?,?,?)';
        $cordovaSQLite.execute($rootScope.db,queryinsertstore,isitable)
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

    return{
            GetMerchant:GetMerchant,
            SetMerchant:SetMerchant
        }
});