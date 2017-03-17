angular.module('starter')
.factory('ProductLiteFac',function($rootScope,$http, $q, $filter, $window,$cordovaSQLite,UtilService)
{
    var GetPureProducts = function (kodestore)
    {
        var deferred = $q.defer();
        var queryselectproduct = 'SELECT * FROM Tbl_Product';
        $cordovaSQLite.execute($rootScope.db, queryselectproduct,[])
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
    
    var SetPureProduct = function (datatosave)
    {
        var deferred        = $q.defer();
        var ITEM_ID         = datatosave.ITEM_ID;
        var ITEM_NM         = datatosave.ITEM_NM;
        var STATUS          = datatosave.STATUS;
        var CREATE_BY       = datatosave.CREATE_BY;
        var UPDATE_BY       = datatosave.UPDATE_BY;
        var CREATE_AT       = datatosave.CREATE_AT;
        var UPDATE_AT       = datatosave.UPDATE_AT;
        var IMG64           = datatosave.IMG64;

        var isitable        = [ITEM_ID,ITEM_NM,STATUS,CREATE_BY,UPDATE_BY,CREATE_AT,UPDATE_AT,IMG64]
        var queryinsertproduct = 'INSERT INTO Tbl_Product (ITEM_ID,ITEM_NM,STATUS,CREATE_BY,UPDATE_BY,CREATE_AT,UPDATE_AT,IMG64) VALUES (?,?,?,?,?,?,?,?)';
        $cordovaSQLite.execute($rootScope.db,queryinsertproduct,isitable)
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
            GetPureProducts:GetPureProducts,
            SetPureProduct:SetPureProduct
        }
});