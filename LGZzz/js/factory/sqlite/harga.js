angular.module('starter')
.factory('HargaLiteFac',function($rootScope,$http, $q, $filter, $window,$cordovaSQLite,UtilService)
{
    var GetHarga = function(OUTLET_CODE,PERIODE_TGL1,PERIODE_TGL2)
    {
        var deferred                = $q.defer();
        var parameter               = [OUTLET_CODE,PERIODE_TGL1,PERIODE_TGL2]
        var queryselectharga        = 'SELECT * FROM Tbl_Harga WHERE OUTLET_CODE= ? AND PERIODE_TGL1 = ? AND PERIODE_TGL2 = ? GROUP BY ITEM_ID';
        $cordovaSQLite.execute($rootScope.db,queryselectharga,parameter)
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
    var SetHarga = function (datatosave)
    {
        var deferred        = $q.defer();
        var ITEM_ID         = datatosave.ITEM_ID;
        var OUTLET_CODE     = datatosave.OUTLET_CODE;
        var ITEM_HARGA      = datatosave.ITEM_HARGA;
        var PERIODE_TGL1    = datatosave.PERIODE_TGL1;
        var PERIODE_TGL2    = datatosave.PERIODE_TGL2;
        var START_TIME      = datatosave.START_TIME;
        var DCRIPT          = datatosave.DCRIPT;

        var isitable            = [ITEM_ID,OUTLET_CODE,ITEM_HARGA,PERIODE_TGL1,PERIODE_TGL2,START_TIME,DCRIPT]
        var queryinsertharga    = 'INSERT INTO Tbl_Harga (ITEM_ID,OUTLET_CODE,ITEM_HARGA,PERIODE_TGL1,PERIODE_TGL2,START_TIME,DCRIPT) VALUES (?,?,?,?,?,?,?)';
        $cordovaSQLite.execute($rootScope.db,queryinsertharga,isitable)
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
            GetHarga:GetHarga,
            SetHarga:SetHarga
        }
});