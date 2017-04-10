angular.module('starter')
.factory('CloseBookLiteFac',function($rootScope,$http, $q, $filter, $window,$cordovaSQLite,UtilService)
{
    var SetCloseBook = function (datatosave)
    {
        var deferred            = $q.defer();
        var TGL_CLOSE           = $filter('date')(new Date(),'yyyy-MM-dd');
        var USER_ID             = datatosave.USER_ID;
        var USERNAME            = datatosave.USERNAME;
        var NAMA_TYPE           = datatosave.NAMA_TYPE;
        var isitable            = [TGL_CLOSE,USER_ID,USERNAME,NAMA_TYPE];
        var queryinsertclose    = 'INSERT INTO Tbl_CloseBook (TGL_CLOSE,USER_ID,USERNAME,NAMA_TYPE) VALUES (?,?,?,?)';
        $cordovaSQLite.execute($rootScope.db,queryinsertclose,isitable)
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

    var GetCloseBookByUsername = function (username)
    {
        var deferred        = $q.defer();
        var TGL_CLOSE       = $filter('date')(new Date(),'yyyy-MM-dd');
        var USERNAME        = username;
        var queryselect     = 'SELECT * FROM Tbl_CloseBook WHERE TGL_CLOSE = ? AND USERNAME = ?';
        $cordovaSQLite.execute($rootScope.db, queryselect,[TGL_CLOSE,USERNAME])
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
            SetCloseBook:SetCloseBook,
            GetCloseBookByUsername:GetCloseBookByUsername
        }
});