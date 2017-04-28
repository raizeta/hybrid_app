angular.module('starter')
.factory('AbsensiLiteFac',function($rootScope,$http, $q, $filter, $window,$cordovaSQLite,UtilService)
{
    var GetAbsensi = function (dataparams)
    {
        var deferred = $q.defer();
        var params   = [dataparams.TGL_SAVE,dataparams.EMP_ID,dataparams.OUTLET_CODE,dataparams.ACCESS_UNIX];
        var queryselectstore = 'SELECT * FROM Tbl_Absensi WHERE TGL_SAVE = ? AND EMP_ID = ? AND OUTLET_CODE = ? AND ACCESS_UNIX = ?';
        $cordovaSQLite.execute($rootScope.db, queryselectstore,params)
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
    
    var SetAbsensi = function (datatosave)
    {
        var deferred        = $q.defer();
        var TGL_SAVE        = $filter('date')(new Date(),'yyyy-MM-dd');
        var WAKTU_ABSENSI   = $filter('date')(new Date(),'yyyy-MM-dd HH:mm:ss');
        var TYPE_ABSENSI    = datatosave.TYPE_ABSENSI;
        var OUTLET_CODE     = datatosave.OUTLET_CODE;
        var EMP_ID          = datatosave.EMP_ID;
        var USERNAME        = datatosave.USERNAME;
        var ACCESS_UNIX     = datatosave.ACCESS_UNIX;
        var IMG_ABSENSI     = datatosave.IMG_ABSENSI;
        var LAT_POST        = datatosave.LAT_POST;
        var LNG_POST        = datatosave.LNG_POST;
        var IS_ONSERVER     = datatosave.IS_ONSERVER;

        var isitable            = [TGL_SAVE,WAKTU_ABSENSI,TYPE_ABSENSI,OUTLET_CODE,EMP_ID,USERNAME,ACCESS_UNIX,IMG_ABSENSI,LAT_POST,LNG_POST,IS_ONSERVER]
        var queryinsertabsensi  = 'INSERT INTO Tbl_Absensi (TGL_SAVE,WAKTU_ABSENSI,TYPE_ABSENSI,OUTLET_CODE,EMP_ID,USERNAME,ACCESS_UNIX,IMG_ABSENSI,LAT_POST,LNG_POST,IS_ONSERVER) VALUES (?,?,?,?,?,?,?,?,?,?,?)';
        $cordovaSQLite.execute($rootScope.db,queryinsertabsensi,isitable)
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

    var UpdateIsOnServer = function (datatoupdate)
    {
        var deferred        = $q.defer();
        var updatestatus    = 'UPDATE Tbl_Absensi SET IS_ONSERVER = ? WHERE OUTLET_CODE = ? AND EMP_ID = ? AND ACCESS_UNIX = ?';
        $cordovaSQLite.execute($rootScope.db,updatestatus,datatoupdate)
        .then(function(result) 
        {
            deferred.resolve(result);
        },
        function(error) 
        {
            deferred.reject(error);
        });
        return deferred.promise; 
    }

    return{
            GetAbsensi:GetAbsensi,
            SetAbsensi:SetAbsensi,
            UpdateIsOnServer:UpdateIsOnServer
        }
});