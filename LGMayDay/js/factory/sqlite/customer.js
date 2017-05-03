angular.module('starter')
.factory('CustomerLiteFac',function($rootScope,$http, $q, $filter, $window,$cordovaSQLite,UtilService)
{

    var SetCustomer = function (datatosave)
    {
        var deferred        = $q.defer();
        var TGL_SAVE        = datatosave.TGL_SAVE;
        var ACCESS_UNIX     = datatosave.ACCESS_UNIX;
        var OUTLET_CODE     = datatosave.OUTLET_CODE;
        var NAME            = datatosave.NAME;
        var EMAIL           = datatosave.EMAIL;
        var PHONE           = datatosave.PHONE;
        var CREATE_AT       = datatosave.CREATE_AT;
        var UPDATE_AT       = datatosave.UPDATE_AT;
        var IS_ONSERVER     = datatosave.IS_ONSERVER;

        var isitable           = [TGL_SAVE,ACCESS_UNIX,OUTLET_CODE,NAME,EMAIL,PHONE,CREATE_AT,UPDATE_AT,IS_ONSERVER]
        var queryinsertcust    = 'INSERT INTO Tbl_Customer (TGL_SAVE,ACCESS_UNIX,OUTLET_CODE,NAME,EMAIL,PHONE,CREATE_AT,UPDATE_AT,IS_ONSERVER) VALUES (?,?,?,?,?,?,?,?,?)';
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

    var GetCustomer = function(ACCESS_UNIX,OUTLET_CODE)
    {
        var deferred                = $q.defer();
        var queryselectcustomer     = 'SELECT * FROM Tbl_Customer WHERE ACCESS_UNIX = ? AND OUTLET_CODE = ? GROUP BY NAME';
        $cordovaSQLite.execute($rootScope.db,queryselectcustomer,[ACCESS_UNIX,OUTLET_CODE])
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

    var UpdateCustomerIsOnServer = function (datatoupdate)
    {
        var deferred        = $q.defer();
        var query           = 'UPDATE Tbl_Customer SET IS_ONSERVER = ? WHERE ACCESS_UNIX = ? AND OUTLET_CODE = ? AND NAME = ?';
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
            SetCustomer:SetCustomer,
            GetCustomer:GetCustomer,
            UpdateCustomerIsOnServer:UpdateCustomerIsOnServer
        }
});