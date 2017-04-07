angular.module('starter')
.factory('SaveToBillLiteFac',function($rootScope,$http, $q, $filter, $window,$cordovaSQLite,UtilService)
{
    var SetSaveToBill = function (datatosave)
    {
        var deferred            = $q.defer();
        var TGL_SAVE            = $filter('date')(new Date(),'yyyy-MM-dd');
        var NOMOR_TRANS         = datatosave.NOMOR_TRANS;
        var ALIAS_TRANS         = datatosave.ALIAS_TRANS;
        var isitable            = [TGL_SAVE,NOMOR_TRANS,ALIAS_TRANS];
        var queryinsertbill     = 'INSERT INTO Tbl_SaveBill (TGL_SAVE,NOMOR_TRANS,ALIAS_TRANS) VALUES (?,?,?)';
        $cordovaSQLite.execute($rootScope.db,queryinsertbill,isitable)
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
    var GetSaveToBillByDate = function ()
    {
        var deferred        = $q.defer();
        var TGL_SAVE        = $filter('date')(new Date(),'yyyy-MM-dd')
        var queryselectbill = 'SELECT * FROM Tbl_SaveBill WHERE TGL_SAVE = ?';
        $cordovaSQLite.execute($rootScope.db, queryselectbill,[TGL_SAVE])
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

    var GetSaveToBillByNomorTrans = function (NOMOR_TRANS)
    {
        var deferred        = $q.defer();
        var queryselectbill = 'SELECT * FROM Tbl_SaveBill WHERE NOMOR_TRANS = ?';
        $cordovaSQLite.execute($rootScope.db, queryselectbill,[NOMOR_TRANS])
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
    
    var DeleteSaveToBillByNomorTrans = function (NOMOR_TRANS)
    {
        var deferred            = $q.defer();
        var querydeletebill     = 'DELETE FROM Tbl_SaveBill WHERE NOMOR_TRANS = ?';
        $cordovaSQLite.execute($rootScope.db,querydeletebill,[NOMOR_TRANS])
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
            SetSaveToBill:SetSaveToBill,
            GetSaveToBillByDate:GetSaveToBillByDate,
            GetSaveToBillByNomorTrans:GetSaveToBillByNomorTrans,
            DeleteSaveToBillByNomorTrans:DeleteSaveToBillByNomorTrans
        }
});