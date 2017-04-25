angular.module('starter')
.factory('CustomerLiteFac',function($rootScope,$http, $q, $filter, $window,$cordovaSQLite,UtilService)
{

    var SetCustomer = function (datatosave)
    {
        var deferred        = $q.defer();
        var NAMA_CUST       = datatosave.NAMA_CUST;
        var EMAIL_CUST      = datatosave.EMAIL_CUST;
        var NO_TELP         = datatosave.NO_TELP;

        var isitable                = [NAMA_CUST,EMAIL_CUST,NO_TELP]
        var queryinsertcust    = 'INSERT INTO Tbl_Customer (NAMA_CUST,EMAIL_CUST,NO_TELP) VALUES (?,?,?)';
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

    var GetCustomer = function()
    {
        var deferred                = $q.defer();
        var queryselectcustomer     = 'SELECT * FROM Tbl_Customer';
        $cordovaSQLite.execute($rootScope.db,queryselectcustomer,[])
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