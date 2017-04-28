angular.module('starter')
.factory('StoreLiteFac',function($rootScope,$http, $q, $filter, $window,$cordovaSQLite,UtilService)
{
    var GetStore = function ()
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
    
    var SetStore = function (datatosave)
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
        var IS_ONSERVER     = datatosave.IS_ONSERVER;

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

    var SetStoreCheck = function (datatosave)
    {
        var deferred        = $q.defer();
        var OUTLET_CODE     = datatosave.OUTLET_CODE;
        var TGL_SAVE        = $filter('date')(new Date(),'yyyy-MM-dd');
        var USERNAME        = datatosave.USERNAME;
        var ACCESS_UNIX     = datatosave.ACCESS_UNIX;
        var STATUS_CHECK    = 1;

        var isitable            = [TGL_SAVE,OUTLET_CODE,USERNAME,ACCESS_UNIX,STATUS_CHECK]
        var queryinsertcheck    = 'INSERT INTO Tbl_StoreCheck (TGL_SAVE,OUTLET_CODE,USERNAME,ACCESS_UNIX,STATUS_CHECK) VALUES (?,?,?,?,?)';
        $cordovaSQLite.execute($rootScope.db,queryinsertcheck,isitable)
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

    var GetStoreCheck = function (dataparams)
    {
        var deferred            = $q.defer();
        var params              = [dataparams.TGL_SAVE,dataparams.OUTLET_CODE,dataparams.USERNAME,dataparams.ACCESS_UNIX];
        var querycheckstore     = 'SELECT * FROM Tbl_StoreCheck WHERE TGL_SAVE = ? AND OUTLET_CODE = ? AND USERNAME = ? AND ACCESS_UNIX = ?';
        $cordovaSQLite.execute($rootScope.db,querycheckstore,params)
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
            GetStore:GetStore,
            SetStore:SetStore,
            SetStoreCheck:SetStoreCheck,
            GetStoreCheck:GetStoreCheck
        }
});