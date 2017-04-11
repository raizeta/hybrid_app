angular.module('starter')
.factory('SummaryLiteFac',function($rootScope,$http, $q, $filter, $window,$cordovaSQLite,UtilService)
{
    var CountTransaksiComplete = function ()
    {
        var deferred            = $q.defer();
        var qcounttransaksi     = 'SELECT count(id) AS jlhcomplete FROM Tbl_CustBuyTrans WHERE STATUS_BUY = ?';
        $cordovaSQLite.execute($rootScope.db,qcounttransaksi,['COMPLETE'])
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

    var CountTransaksiInComplete = function ()
    {
        var deferred            = $q.defer();
        var qcounttransaksi     = 'SELECT count(id) AS jlhincomplete FROM Tbl_CustBuyTrans WHERE STATUS_BUY = ?';
        $cordovaSQLite.execute($rootScope.db,qcounttransaksi,['INCOMPLETE'])
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

    var JoinTransWithShopCart = function ()
    {
        var deferred            = $q.defer();
        var qcounttransaksi     = 'SELECT * FROM Tbl_CustBuyTrans JOIN Tbl_ShopCart ON  Tbl_CustBuyTrans.NOMOR_TRANS = Tbl_ShopCart.NOMOR_TRANS WHERE Tbl_CustBuyTrans.STATUS_BUY = ?';
        $cordovaSQLite.execute($rootScope.db,qcounttransaksi,['COMPLETE'])
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
            CountTransaksiInComplete:CountTransaksiInComplete,
            JoinTransWithShopCart:JoinTransWithShopCart
        }
});