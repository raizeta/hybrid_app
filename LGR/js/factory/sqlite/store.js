angular.module('starter')
.factory('StoreLiteFac',function($rootScope,$http, $q, $filter, $window,$cordovaSQLite,UtilService)
{
    var GetPureStores = function ()
    {
        var deferred = $q.defer();
        var queryselectstore = 'SELECT * FROM Tbl_Store';
        $cordovaSQLite.execute($rootScope.db, queryselectstore,[])
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
    
    var SetPureStore = function (datatosave)
    {
        var deferred        = $q.defer();
        var OUTLET_BARCODE  = datatosave.OUTLET_BARCODE;
        var OUTLET_NM       = datatosave.OUTLET_NM;
        var LOCATE          = datatosave.LOCATE;
        var LOCATE_NAME     = datatosave.LOCATE_NAME;
        var LOCATE_SUB      = datatosave.LOCATE_SUB;
        var LOCATE_SUB_NAME = datatosave.LOCATE_SUB_NAME;
        var ALAMAT          = datatosave.ALAMAT;
        var PIC             = datatosave.PIC;
        var TLP             = datatosave.TLP;
        var STATUS          = datatosave.STATUS;
        var CREATE_BY       = datatosave.CREATE_BY;
        var UPDATE_BY       = datatosave.UPDATE_BY;
        var CREATE_AT       = datatosave.CREATE_AT;
        var UPDATE_AT       = datatosave.UPDATE_AT;

        var isitable            = [OUTLET_BARCODE,OUTLET_NM,LOCATE,LOCATE_NAME,LOCATE_SUB,LOCATE_SUB_NAME,ALAMAT,PIC,TLP,STATUS,CREATE_BY,UPDATE_BY,CREATE_AT,UPDATE_AT]
        var queryinsertstore    = 'INSERT INTO Tbl_Store (OUTLET_BARCODE,OUTLET_NM,LOCATE,LOCATE_NAME,LOCATE_SUB,LOCATE_SUB_NAME,ALAMAT,PIC,TLP,STATUS,CREATE_BY,UPDATE_BY,CREATE_AT,UPDATE_AT) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)';
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
            GetPureStores:GetPureStores,
            SetPureStore:SetPureStore
        }
});