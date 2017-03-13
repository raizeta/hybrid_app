'use strict';
myAppModule.factory('ProductLiteFac',
function($rootScope,$http, $q, $filter, $window,$cordovaSQLite)
{
    var GetProduct = function (tanggalplan,userid)
    {
        var deferred = $q.defer();
        var queryselectproduct = 'SELECT * FROM Tbl_Product WHERE TGL = ? AND USER_ID = ?';
        $cordovaSQLite.execute($rootScope.db, queryselectproduct, [tanggalplan, userid])
        .then(function(result) 
        {
            deferred.resolve(result);
        },
        function (error)
        {
            deferred.rejected(error); 
        });
        return deferred.promise;
    }
    
    var SetProduct = function (isitable)
    {
       var deferred = $q.defer();
       var queryinsertproduct = 'INSERT INTO Tbl_Product () VALUES (?)';
        $cordovaSQLite.execute($rootScope.db,queryinsertproduct,isitable)
        .then(function(result) 
        {
            deferred.resolve(result);
        },
        function (error)
        {
            deferred.rejected(error);
        });
        return deferred.promise; 
    }

    return{
            GetProduct:GetProduct,
            SetProduct:SetProduct
        }
});