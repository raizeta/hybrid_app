angular.module('starter')
.factory('InvCheckLiteFac',function($rootScope,$http, $q, $filter, $window,$cordovaSQLite,UtilService)
{
    var GetInvChecks = function (TGL_CHECK,NAMA_INV)
    {
        var deferred = $q.defer();
        var queryselectinvcheck = 'SELECT * FROM Tbl_InvCheck WHERE TGL_CHECK = ? AND NAMA_INV = ?';
        $cordovaSQLite.execute($rootScope.db,queryselectinvcheck,[TGL_CHECK,NAMA_INV])
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
    
    var SetInvChecks = function (datatosave)
    {
        var deferred            = $q.defer();
        var TGL_CHECK           = datatosave.TGL_CHECK;
        var DATETIME_CHECK      = datatosave.DATETIME_CHECK;
        var NAMA_INV            = datatosave.NAMA_INV;
        var STATUS_CHECK        = datatosave.STATUS_CHECK;
        var isitable            = [TGL_CHECK,DATETIME_CHECK,NAMA_INV,STATUS_CHECK];
        var queryinsertinvcheck  = 'INSERT INTO Tbl_InvCheck (TGL_CHECK,DATETIME_CHECK,NAMA_INV,STATUS_CHECK) VALUES (?,?,?,?)';
        $cordovaSQLite.execute($rootScope.db,queryinsertinvcheck,isitable)
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
            GetInvChecks:GetInvChecks,
            SetInvChecks:SetInvChecks
        }
});