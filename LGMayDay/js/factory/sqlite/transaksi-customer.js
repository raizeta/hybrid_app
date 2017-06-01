angular.module('starter')
.factory('TransCustLiteFac',function($rootScope,$http, $q, $filter, $window,$cordovaSQLite,UtilService)
{
    var GetTransCustsHeader = function (TRANS_DATE,ACCESS_UNIX,OUTLET_ID)
    {
        var deferred = $q.defer();
        var queryselecttranscust = 'SELECT * FROM Tbl_CustBuyTrans WHERE TRANS_DATE = ? AND ACCESS_UNIX = ? AND OUTLET_ID = ?';
        $cordovaSQLite.execute($rootScope.db, queryselecttranscust,[TRANS_DATE,ACCESS_UNIX,OUTLET_ID])
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

    var GetTransCustsHeaderByTransId = function (TRANS_ID)
    {
        var deferred    = $q.defer();
        var query       = 'SELECT * FROM Tbl_CustBuyTrans WHERE TRANS_ID = ?';
        $cordovaSQLite.execute($rootScope.db,query,[TRANS_ID])
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
    var GetTransCustsHeaderWithStatus = function (TRANS_DATE,ACCESS_UNIX,OUTLET_ID,STATUS_BUY)
    {
        var deferred = $q.defer();
        var queryselecttranscust = 'SELECT * FROM Tbl_CustBuyTrans WHERE TRANS_DATE = ? AND ACCESS_UNIX = ? AND OUTLET_ID = ? AND STATUS_BUY = ?';
        $cordovaSQLite.execute($rootScope.db, queryselecttranscust,[TRANS_DATE,ACCESS_UNIX,OUTLET_ID,STATUS_BUY])
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
    var SetTransCustsHeader = function (datatosave)
    {
        var deferred        = $q.defer();
        var ID_SERVER       = datatosave.ID_SERVER;
        var TRANS_DATE      = datatosave.TRANS_DATE;
        var TRANS_ID        = datatosave.TRANS_ID;
        var ACCESS_UNIX     = datatosave.ACCESS_UNIX;
        var OUTLET_ID       = datatosave.OUTLET_ID;
        var TOTAL_ITEM      = datatosave.TOTAL_ITEM;
        var TOTAL_HARGA     = datatosave.TOTAL_HARGA;
        var TYPE_PAY        = datatosave.TYPE_PAY;
        var BANK_NM         = datatosave.BANK_NM;
        var BANK_NO         = datatosave.BANK_NO;
        var CONSUMER_NM     = datatosave.CONSUMER_NM;
        var CONSUMER_EMAIL  = datatosave.CONSUMER_EMAIL;
        var CONSUMER_PHONE  = datatosave.CONSUMER_PHONE;
        var CREATE_BY       = datatosave.CREATE_BY;
        var CREATE_AT       = datatosave.CREATE_AT;
        var UPDATE_BY       = datatosave.UPDATE_BY;
        var UPDATE_AT       = datatosave.UPDATE_AT;
        var STATUS          = datatosave.STATUS;
        var STATUS_BUY      = datatosave.STATUS_BUY;
        var SHIFT_ID        = datatosave.SHIFT_ID;
        var IS_ONSERVER     = datatosave.IS_ONSERVER;

        var isitable                = [ID_SERVER,TRANS_DATE,TRANS_ID,ACCESS_UNIX,OUTLET_ID,TOTAL_ITEM,TOTAL_HARGA,TYPE_PAY,BANK_NM,BANK_NO,CONSUMER_NM,CONSUMER_EMAIL,CONSUMER_PHONE,CREATE_BY,CREATE_AT,UPDATE_BY,UPDATE_AT,STATUS,STATUS_BUY,SHIFT_ID,IS_ONSERVER]
        var queryinserttranscust    = 'INSERT INTO Tbl_CustBuyTrans (ID_SERVER,TRANS_DATE,TRANS_ID,ACCESS_UNIX,OUTLET_ID,TOTAL_ITEM,TOTAL_HARGA,TYPE_PAY,BANK_NM,BANK_NO,CONSUMER_NM,CONSUMER_EMAIL,CONSUMER_PHONE,CREATE_BY,CREATE_AT,UPDATE_BY,UPDATE_AT,STATUS,STATUS_BUY,SHIFT_ID,IS_ONSERVER) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)';
        $cordovaSQLite.execute($rootScope.db,queryinserttranscust,isitable)
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

    var UpdateTransCustsHeader = function (datatoupdate)
    {
        var deferred        = $q.defer();
        var query           = 'UPDATE Tbl_CustBuyTrans SET STATUS_BUY = ?,TOTAL_HARGA = ?,TYPE_PAY = ?,TOTAL_ITEM = ?, BANK_NM = ?, BANK_NO = ?,SHIFT_ID = ? WHERE TRANS_ID = ?';
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
    var UpdateTransCustsHeaderBuyer = function (datatoupdate)
    {
        var deferred        = $q.defer();
        var updatestatusbuy = 'UPDATE Tbl_CustBuyTrans SET CONSUMER_NM = ?,CONSUMER_EMAIL = ?,CONSUMER_PHONE = ? WHERE TRANS_ID = ?';
        $cordovaSQLite.execute($rootScope.db,updatestatusbuy,datatoupdate)
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
    var UpdateTransCustHeaderIsOnServer = function (TRANS_ID,ID_SERVER)
    {
        var deferred        = $q.defer();
        var ID_SERVER       = ID_SERVER;
        var STATUS          = 1;
        var IS_ONSERVER     = 1;
        var NOMOR_TRANS     = TRANS_ID;
        var query           = 'UPDATE Tbl_CustBuyTrans SET ID_SERVER = ?, STATUS = ?, IS_ONSERVER = ? WHERE TRANS_ID = ?';
        $cordovaSQLite.execute($rootScope.db,query,[ID_SERVER,STATUS,IS_ONSERVER,TRANS_ID])
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
            GetTransCustsHeader:GetTransCustsHeader,
            GetTransCustsHeaderByTransId:GetTransCustsHeaderByTransId,
            GetTransCustsHeaderWithStatus:GetTransCustsHeaderWithStatus,
            SetTransCustsHeader:SetTransCustsHeader,
            UpdateTransCustsHeader:UpdateTransCustsHeader,
            UpdateTransCustsHeaderBuyer:UpdateTransCustsHeaderBuyer,
            UpdateTransCustHeaderIsOnServer:UpdateTransCustHeaderIsOnServer
        }
});