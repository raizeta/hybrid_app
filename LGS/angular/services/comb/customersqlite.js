'use strict';
myAppModule.factory('CustomerSqliteFac',
function($rootScope,$http,$q,$filter,$cordovaSQLite,UtilService)
{
    var GetCustomers  = function ()
    {
        var deferred        = $q.defer();
        var querycustomer    = 'SELECT * FROM Customers';
        $cordovaSQLite.execute($rootScope.db,querycustomer,[])
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
    var SetCustomers  = function (datacustomer)
    {
        var deferred        = $q.defer();
        var newCUST_KD      = datacustomer.CUST_KD;
        var newCUST_NM      = datacustomer.CUST_NM;
        var newCUST_GRP     = datacustomer.CUST_GRP;
        var newSCDL_GROUP   = datacustomer.SCDL_GROUP;
        var newSTATUS       = datacustomer.STATUS;

        var isitable        = [newCUST_KD,newCUST_NM,newCUST_GRP,newSCDL_GROUP,newSTATUS]
        var querycustomer   = 'INSERT INTO Customers (CUST_KD,CUST_NM,CUST_GRP,SCDL_GROUP,STATUS) VALUES (?,?,?,?,?)';
        $cordovaSQLite.execute($rootScope.db,querycustomer,isitable)
        .then(function(result) 
        {
            deferred.resolve(result);
            console.log("Customer Berhasil Disimpan Di Local");
        },
        function (error)
        {
            deferred.reject(error);
        });
        return deferred.promise; 
    }


    return{
            GetCustomers:GetCustomers,
            SetCustomers:SetCustomers
        }
});