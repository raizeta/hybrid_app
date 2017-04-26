angular.module('starter')
.factory('CustomerLiteFac',function($rootScope,$http, $q, $filter, $window,$cordovaSQLite,UtilService)
{

    var SetCustomer = function (datatosave)
    {
        var deferred        = $q.defer();
        var TGL_SAVE        = datatosave.TGL_SAVE;
        var NAMA_CUST       = datatosave.NAMA_CUST;
        var EMAIL_CUST      = datatosave.EMAIL_CUST;
        var NO_TELP         = datatosave.NO_TELP;
        var OUTLET_CODE     = datatosave.OUTLET_CODE;
        var IS_ONSERVER     = datatosave.IS_ONSERVER;

        var isitable           = [TGL_SAVE,NAMA_CUST,EMAIL_CUST,NO_TELP,OUTLET_CODE,IS_ONSERVER]
        var queryinsertcust    = 'INSERT INTO Tbl_Customer (TGL_SAVE,NAMA_CUST,EMAIL_CUST,NO_TELP,OUTLET_CODE,IS_ONSERVER) VALUES (?,?,?,?,?,?)';
        $cordovaSQLite.execute($rootScope.db,queryinsertcust,isitable)
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

    var GetCustomer = function(OUTLET_CODE)
    {
        var deferred                = $q.defer();
        var queryselectcustomer     = 'SELECT * FROM Tbl_Customer WHERE OUTLET_CODE = ?';
        $cordovaSQLite.execute($rootScope.db,queryselectcustomer,[OUTLET_CODE])
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
            SetCustomer:SetCustomer,
            GetCustomer:GetCustomer
        }
});