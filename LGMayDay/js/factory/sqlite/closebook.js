angular.module('starter')
.factory('CloseBookLiteFac',function($rootScope,$http, $q, $filter, $window,$cordovaSQLite,UtilService)
{
    var SetOpenCloseBook = function (datatosave)
    {
        var deferred            = $q.defer();
        var TGL_CLOSE           = datatosave.TGL_CLOSE;
        var ACCESS_UNIX         = datatosave.ACCESS_UNIX;
        var OUTLET_CODE         = datatosave.OUTLET_CODE;
        var CASHINDRAWER        = datatosave.CASHINDRAWER;
        var CHECKCASH           = datatosave.CHECKCASH;
        var ADDCASH             = datatosave.ADDCASH;
        var SELLCASH            = datatosave.SELLCASH;
        var TOTALCASH           = datatosave.TOTALCASH;
        var WITHDRAW            = datatosave.WITHDRAW;
        var IS_OPEN             = datatosave.IS_OPEN;
        var IS_CLOSE            = datatosave.IS_CLOSE;
        var IS_ONSERVER         = datatosave.IS_ONSERVER;
        var isitable            = [TGL_CLOSE,ACCESS_UNIX,OUTLET_CODE,CASHINDRAWER,CHECKCASH,ADDCASH,SELLCASH,TOTALCASH,WITHDRAW,IS_OPEN,IS_CLOSE,IS_ONSERVER];
        var queryinsertclose    = 'INSERT INTO Tbl_CloseBook (TGL_CLOSE,ACCESS_UNIX,OUTLET_CODE,CASHINDRAWER,CHECKCASH,ADDCASH,SELLCASH,TOTALCASH,WITHDRAW,IS_OPEN,IS_CLOSE,IS_ONSERVER) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)';
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

    var GetOpenCloseBook = function (TGL_CLOSE,ACCESS_UNIX,OUTLET_CODE,IS_OPEN,IS_CLOSE)
    {
        var deferred        = $q.defer();
        var queryselect     = 'SELECT * FROM Tbl_CloseBook WHERE TGL_CLOSE = ? AND ACCESS_UNIX = ? AND OUTLET_CODE = ? AND IS_OPEN = ? AND IS_CLOSE = ?';
        $cordovaSQLite.execute($rootScope.db, queryselect,[TGL_CLOSE,ACCESS_UNIX,OUTLET_CODE,IS_OPEN,IS_CLOSE])
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

    var UpdateOpenCloseBook = function (datatoupdate)
    {
        var deferred        = $q.defer();
        var SELLCASH        = datatoupdate.SELLCASH;
        var TOTALCASH       = datatoupdate.TOTALCASH;
        var WITHDRAW        = datatoupdate.WITHDRAW;
        var IS_CLOSE        = datatoupdate.IS_CLOSE;
        var id              = datatoupdate.id
        var datatoupdate    = [SELLCASH,TOTALCASH,WITHDRAW,IS_CLOSE,id]
        var query           = 'UPDATE Tbl_CloseBook SET SELLCASH = ?,TOTALCASH = ?,WITHDRAW = ?,IS_CLOSE = ? WHERE id = ?';
        $cordovaSQLite.execute($rootScope.db,query,datatoupdate)
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
    
    var SetSetoranBook = function (datatosave)
    {
        var deferred            = $q.defer();
        var CLOSING_ID          = datatosave.CLOSING_ID;
        var ACCESS_UNIX         = datatosave.ACCESS_UNIX;
        var STORAN_DATE         = datatosave.STORAN_DATE;
        var OUTLET_CODE         = datatosave.OUTLET_CODE;
        var TTL_STORAN          = datatosave.TTL_STORAN;
        var IMG                 = datatosave.IMG;
        var STATUS              = datatosave.STATUS;
        var CREATE_BY           = datatosave.CREATE_BY;
        var CREATE_AT           = datatosave.CREATE_AT;
        var UPDATE_BY           = datatosave.UPDATE_BY;
        var UPDATE_AT           = datatosave.UPDATE_AT;
        var IS_ONSERVER         = datatosave.IS_ONSERVER;
        var isitable            = [CLOSING_ID,ACCESS_UNIX,STORAN_DATE,OUTLET_CODE,TTL_STORAN,IMG,STATUS,CREATE_BY,CREATE_AT,UPDATE_BY,UPDATE_AT,IS_ONSERVER];
        var query               = 'INSERT INTO Tbl_Setoran (CLOSING_ID,ACCESS_UNIX,STORAN_DATE,OUTLET_CODE,TTL_STORAN,IMG,STATUS,CREATE_BY,CREATE_AT,UPDATE_BY,UPDATE_AT,IS_ONSERVER) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)';
        $cordovaSQLite.execute($rootScope.db,query,isitable)
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

    var GetSetoranBook = function (STORAN_DATE,ACCESS_UNIX,OUTLET_CODE,STATUS,IS_ONSERVER)
    {
        var deferred        = $q.defer();
        var query           = 'SELECT * FROM Tbl_Setoran WHERE STORAN_DATE = ? AND ACCESS_UNIX = ? AND OUTLET_CODE = ? AND STATUS = ? AND IS_ONSERVER = ?';
        $cordovaSQLite.execute($rootScope.db, query,[STORAN_DATE,ACCESS_UNIX,OUTLET_CODE,STATUS,IS_ONSERVER])
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

    var UpdateStatusSetoranBook = function (datatoupdate)
    {
        var deferred        = $q.defer();
        var STATUS          = datatoupdate.STATUS;
        var id              = datatoupdate.id
        var datatoupdate    = [STATUS,id]
        var query           = 'UPDATE Tbl_Setoran SET STATUS = ? WHERE id = ?';
        $cordovaSQLite.execute($rootScope.db,query,datatoupdate)
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
    var UpdateIsOnServerSetoranBook = function (datatoupdate)
    {
        var deferred        = $q.defer();
        var STATUS          = datatoupdate.STATUS;
        var id              = datatoupdate.id
        var datatoupdate    = [STATUS,id]
        var query           = 'UPDATE Tbl_Setoran SET IS_ONSERVER = ? WHERE id = ?';
        $cordovaSQLite.execute($rootScope.db,query,datatoupdate)
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
            SetOpenCloseBook:SetOpenCloseBook,
            GetOpenCloseBook:GetOpenCloseBook,
            UpdateOpenCloseBook:UpdateOpenCloseBook,
            SetSetoranBook:SetSetoranBook,
            GetSetoranBook:GetSetoranBook,
            UpdateStatusSetoranBook:UpdateStatusSetoranBook,
            UpdateIsOnServerSetoranBook:UpdateIsOnServerSetoranBook
        }
});