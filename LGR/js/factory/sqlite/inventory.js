angular.module('starter')
.factory('InventoryLiteFac',function($rootScope,$http, $q, $filter, $window,$cordovaSQLite)
{
    var GetInventory = function (tanggal_transaksi)
    {
        var deferred = $q.defer();
        var queryselectinventory = 'SELECT * FROM Tbl_Inv_Shop WHERE tanggal_transaksi = ?';
        $cordovaSQLite.execute($rootScope.db, queryselectinventory, [tanggal_transaksi])
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
    
    var SetInventory = function (datainventory)
    {
       var deferred = $q.defer();
       var queryinsertinventory = 'INSERT INTO Tbl_Inv_Shop (tanggal_transaksi,nama_product,qty_arrived,qty_booking,qty_checking,qty_forsale,status_check) VALUES (?,?,?,?,?,?,?)';
        $cordovaSQLite.execute($rootScope.db,queryinsertinventory,datainventory)
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

    var UpdateInventory = function (datainventory)
    {
        var deferred = $q.defer();
        var queryupdateinventory = 'UPDATE Tbl_Inv_Shop SET qty_forsale = ?';
        $cordovaSQLite.execute($rootScope.db,queryupdateinventory,datainventory)
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
            GetProduct:GetProduct,
            SetProduct:SetProduct,
            UpdateInventory:UpdateInventory
        }
});