'use strict';
myAppModule.factory('AgendaSqliteServices', ["$rootScope","$http","$q","$filter","$window","$cordovaSQLite",
function($rootScope,$http, $q, $filter, $window,$cordovaSQLite)
{
    var getUrl = function()
    {
        return "http://api.lukisongroup.com/master";
    }
    var gettoken = function()
    {
        return "?access-token=azLSTAYr7Y7TLsEAML-LsVq9cAXLyAWa";
    }
    
    var getCheckinCheckoutStatus = function (tanggalplan,userid)
    {
        var deferred = $q.defer();
        var queryagendatoday = "SELECT * FROM Agenda WHERE TGL = ? AND USER_ID = ? AND STSCHECK_IN = ? AND STSCHECK_OUT = ?";
        $cordovaSQLite.execute($rootScope.db, queryagendatoday, [tanggalplan, userid, 1, 0])
        .then(function(result) 
        {            
            if (result.rows.length > 0) 
            {
                deferred.resolve(result.rows.item(0).ID_SERVER);
            }
            else
            {
                deferred.resolve([]);
            }
        },
        function (error)
        {
            deferred.rejected(error);
        });
        return deferred.promise;
    }

    var getAgendaByIdServer = function (ID_SERVER)
    {
        var deferred = $q.defer();
        var queryagendatoday = "SELECT * FROM Agenda WHERE ID_SERVER = ?";
        $cordovaSQLite.execute($rootScope.db, queryagendatoday, [ID_SERVER])
        .then(function(result) 
        {
            if (result.rows.length > 0) 
            {
                deferred.resolve(result.rows.item(0));
            }
            else
            {
                deferred.resolve([]);
            }
        },
        function (error)
        {
            deferred.rejected(error);
        });
        return deferred.promise;
    }

    var getAgendaTodayForOutCase = function (TGL,USER_ID)
    {
        var deferred = $q.defer();
        var queryagendatoday = "SELECT * FROM Agenda WHERE TGL = ? AND USER_ID = ?";
        $cordovaSQLite.execute($rootScope.db, queryagendatoday, [TGL,USER_ID])
        .then(function(result) 
        {
            if (result.rows.length > 0) 
            {
                var customers = [];
                var l = result.rows.length;
                for (var i=0; i < l; i++) 
                {
                    var customer = {};
                    customer.ID                         = result.rows.item(i).ID_SERVER;
                    customer.CUST_ID                    = result.rows.item(i).CUST_ID;
                    customer.CUST_NM                    = result.rows.item(i).CUST_NM;
                    customers.push(customer);
                }
                deferred.resolve(customers);
            }
            else
            {
                deferred.resolve([]);
            }
        },
        function (error)
        {
            deferred.rejected(error);
        });
        return deferred.promise;
    }
    
    return{
            getCheckinCheckoutStatus:getCheckinCheckoutStatus,
            getAgendaByIdServer:getAgendaByIdServer,
            getAgendaTodayForOutCase:getAgendaTodayForOutCase
        }
}]);