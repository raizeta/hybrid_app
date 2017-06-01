angular.module('starter')
.factory('SummaryLiteFac',function($rootScope,$http, $q, $filter, $window,$cordovaSQLite,UtilService)
{
    var CountTransaksiComplete = function (STATUS_BUY,TRANS_DATE)
    {
        var deferred            = $q.defer();
        var qcounttransaksi     = 'SELECT count(id) AS jlhcomplete FROM Tbl_CustBuyTrans WHERE STATUS_BUY = ? AND TRANS_DATE = ?';
        $cordovaSQLite.execute($rootScope.db,qcounttransaksi,[STATUS_BUY,TRANS_DATE])
        .then(function(result) 
        {
            var response = UtilService.SqliteToArray(result);
            deferred.resolve(response);
        },
        function (error)
        {
            deferred.reject(error);
        });
        return deferred.promise; 
    }

    var SumTransHeaderComplete = function (ACCESS_UNIX,OUTLET_ID,STATUS_BUY,TRANS_DATE)
    {
        var deferred            = $q.defer();
        var qcounttransaksi     = 'SELECT sum(TOTAL_HARGA) AS TOTAL FROM Tbl_CustBuyTrans WHERE ACCESS_UNIX = ? AND OUTLET_ID = ? AND STATUS_BUY = ? AND TRANS_DATE = ?';
        $cordovaSQLite.execute($rootScope.db,qcounttransaksi,[ACCESS_UNIX,OUTLET_ID,STATUS_BUY,TRANS_DATE])
        .then(function(result) 
        {
            var response = UtilService.SqliteToArray(result);
            deferred.resolve(response);
        },
        function (error)
        {
            deferred.reject(error);
        });
        return deferred.promise; 
    }

    var SumTransHeaderCompletePerShift = function (ACCESS_UNIX,OUTLET_ID,STATUS_BUY,TRANS_DATE,SHIFT_ID)
    {
        var deferred            = $q.defer();
        var qcounttransaksi     = 'SELECT sum(TOTAL_HARGA) AS TOTAL FROM Tbl_CustBuyTrans WHERE ACCESS_UNIX = ? AND OUTLET_ID = ? AND STATUS_BUY = ? AND TRANS_DATE = ? AND SHIFT_ID = ?';
        $cordovaSQLite.execute($rootScope.db,qcounttransaksi,[ACCESS_UNIX,OUTLET_ID,STATUS_BUY,TRANS_DATE,SHIFT_ID])
        .then(function(result) 
        {
            var response = UtilService.SqliteToArray(result);
            deferred.resolve(response);
        },
        function (error)
        {
            deferred.reject(error);
        });
        return deferred.promise; 
    }

    var JoinTransWithShopCart = function (STATUS_BUY)
    {
        var deferred            = $q.defer();
        var qcounttransaksi     = 'SELECT * FROM Tbl_CustBuyTrans JOIN Tbl_ShopCart ON  Tbl_CustBuyTrans.TRANS_ID = Tbl_ShopCart.NOMOR_TRANS WHERE Tbl_CustBuyTrans.STATUS_BUY = ?';
        $cordovaSQLite.execute($rootScope.db,qcounttransaksi,[STATUS_BUY])
        .then(function(result) 
        {
            var response = UtilService.SqliteToArray(result);
            deferred.resolve(response);
        },
        function (error)
        {
            deferred.reject(error);
        });
        return deferred.promise; 
    }

    var BayarCash = function (STATUS_BUY,TRANS_DATE,ACCESS_UNIX,TYPE_PAY,OUTLET_ID)
    {
        var deferred            = $q.defer();
        var qcounttransaksi     = 'SELECT * FROM Tbl_CustBuyTrans WHERE STATUS_BUY = ? AND TRANS_DATE = ? AND ACCESS_UNIX = ? AND TYPE_PAY = ? AND OUTLET_ID = ?';
        $cordovaSQLite.execute($rootScope.db,qcounttransaksi,[STATUS_BUY,TRANS_DATE,ACCESS_UNIX,TYPE_PAY,OUTLET_ID])
        .then(function(result) 
        {
            var response = UtilService.SqliteToArray(result);
            deferred.resolve(response);
        },
        function (error)
        {
            deferred.reject(error);
        });
        return deferred.promise; 
    }

    
    return{
            CountTransaksiComplete:CountTransaksiComplete,
            SumTransHeaderComplete:SumTransHeaderComplete,
            SumTransHeaderCompletePerShift:SumTransHeaderCompletePerShift,
            JoinTransWithShopCart:JoinTransWithShopCart,
            BayarCash:BayarCash
        }
});