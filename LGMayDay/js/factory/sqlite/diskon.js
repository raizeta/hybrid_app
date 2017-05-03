angular.module('starter')
.factory('DiskonLiteFac',function($rootScope,$http, $q, $filter, $window,$cordovaSQLite,UtilService)
{
    var GetDiskon = function(OUTLET_CODE,PERIODE_TGL1,PERIODE_TGL2)
    {
        var deferred                = $q.defer();
        var parameter               = [OUTLET_CODE,PERIODE_TGL1,PERIODE_TGL2]
        var queryselectharga        = 'SELECT * FROM Tbl_Diskon WHERE OUTLET_CODE= ? AND PERIODE_TGL1 = ? AND PERIODE_TGL2 = ? GROUP BY ITEM_ID';
        $cordovaSQLite.execute($rootScope.db,queryselectharga,parameter)
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
    var SetDiskon = function (datatosave)
    {
        var deferred            = $q.defer();
        var ITEM_ID             = datatosave.ITEM_ID;
        var OUTLET_CODE         = datatosave.OUTLET_CODE;
        var DISCOUNT_PERCENT    = datatosave.DISCOUNT_PERCENT;
        var MAX_DISCOUNT        = datatosave.MAX_DISCOUNT;
        var PERIODE_TGL1        = datatosave.PERIODE_TGL1;
        var PERIODE_TGL2        = datatosave.PERIODE_TGL2;
        var PERIODE_TIME1       = datatosave.PERIODE_TIME1;
        var PERIODE_TIME2       = datatosave.PERIODE_TIME2;
        var STATUS              = datatosave.START_TIME;
        var DCRIPT              = datatosave.DCRIPT;

        var isitable            = [ITEM_ID,OUTLET_CODE,DISCOUNT_PERCENT,MAX_DISCOUNT,PERIODE_TGL1,PERIODE_TGL2,PERIODE_TIME1,PERIODE_TIME2,STATUS,DCRIPT]
        var queryinsertdiskon   = 'INSERT INTO Tbl_Diskon (ITEM_ID,OUTLET_CODE,DISCOUNT_PERCENT,MAX_DISCOUNT,PERIODE_TGL1,PERIODE_TGL2,PERIODE_TIME1,PERIODE_TIME2,STATUS,DCRIPT) VALUES (?,?,?,?,?,?,?,?,?,?)';
        $cordovaSQLite.execute($rootScope.db,queryinsertdiskon,isitable)
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
            GetDiskon:GetDiskon,
            SetDiskon:SetDiskon
        }
});