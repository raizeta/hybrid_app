angular.module('starter')
.factory('TransCustLiteFac',function($rootScope,$http, $q, $filter, $window,$cordovaSQLite,UtilService)
{
    var GetTransCustsByDate = function (TGL_TRANS)
    {
        var deferred = $q.defer();
        var queryselecttranscust = 'SELECT * FROM Tbl_CustBuyTrans WHERE TGL_TRANS = ?';
        $cordovaSQLite.execute($rootScope.db, queryselecttranscust,[TGL_TRANS])
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
    var GetTransCustsByDateStatus = function (TGL_TRANS,STATUS_BUY)
    {
        var deferred = $q.defer();
        var queryselecttranscust = 'SELECT * FROM Tbl_CustBuyTrans WHERE TGL_TRANS = ? AND STATUS_BUY = ?';
        $cordovaSQLite.execute($rootScope.db, queryselecttranscust,[TGL_TRANS,STATUS_BUY])
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
    var SetTransCusts = function (datatosave)
    {
        var deferred        = $q.defer();
        var TGL_TRANS       = datatosave.TGL_TRANS;
        var DATETIME_TRANS  = datatosave.DATETIME_TRANS;
        var NOMOR_TRANS     = datatosave.NOMOR_TRANS;
        var CASHIER_ID      = datatosave.CASHIER_ID;
        var CASHIER_NAME    = datatosave.CASHIER_NAME;
        var STATUS_BUY      = datatosave.STATUS_BUY;

        var isitable                = [TGL_TRANS,DATETIME_TRANS,NOMOR_TRANS,CASHIER_ID,CASHIER_NAME,STATUS_BUY]
        var queryinserttranscust    = 'INSERT INTO Tbl_CustBuyTrans (TGL_TRANS,DATETIME_TRANS,NOMOR_TRANS,CASHIER_ID,CASHIER_NAME,STATUS_BUY) VALUES (?,?,?,?,?,?)';
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

    var UpdateTransCusts = function (datatoupdate)
    {
        var deferred        = $q.defer();
        var updatestatusbuy = 'UPDATE Tbl_CustBuyTrans SET STATUS_BUY = ?,TOTAL_SPENT = ?,METHOD_PEMBAYARAN = ? WHERE NOMOR_TRANS = ?';
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

    var UpdateBuyerTransCusts = function (datatoupdate)
    {
        console.log(datatoupdate);
        var deferred        = $q.defer();
        var updatestatusbuy = 'UPDATE Tbl_CustBuyTrans SET BUYER_ID = ?,BUYER_NAME = ? WHERE NOMOR_TRANS = ?';
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

    var SetTransCustsDetail = function (datatosave)
    {
        var deferred            = $q.defer();
        var TGL_BUYTRANS        = datatosave.TGL_BUYTRANS;
        var DATETIME_BUYTRANS   = datatosave.DATETIME_BUYTRANS;
        var NOMOR_TRANS         = datatosave.NOMOR_TRANS;
        var ITEM_ID             = datatosave.ITEM_ID;
        var ITEM_NAMA           = datatosave.ITEM_NAMA;
        var HARGA_ITEM          = datatosave.HARGA_ITEM;
        var QTY_BUY             = datatosave.QTY_BUY;
        var DISCOUNT_ITEM       = datatosave.DISCOUNT_ITEM;

        var isitable                        = [TGL_BUYTRANS,DATETIME_BUYTRANS,NOMOR_TRANS,ITEM_ID,ITEM_NAMA,HARGA_ITEM,QTY_BUY,DISCOUNT_ITEM]
        var queryinserttranscustbuydetail   = 'INSERT INTO Tbl_CustBuyDetail (TGL_BUYTRANS,DATETIME_BUYTRANS,NOMOR_TRANS,ITEM_ID,ITEM_NAMA,HARGA_ITEM,QTY_BUY,DISCOUNT_ITEM) VALUES (?,?,?,?,?,?,?,?)';
        $cordovaSQLite.execute($rootScope.db,queryinserttranscustbuydetail,isitable)
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
            GetTransCustsByDate:GetTransCustsByDate,
            GetTransCustsByDateStatus:GetTransCustsByDateStatus,
            SetTransCusts:SetTransCusts,
            UpdateTransCusts:UpdateTransCusts,
            UpdateBuyerTransCusts:UpdateBuyerTransCusts,
            SetTransCustsDetail:SetTransCustsDetail
        }
});