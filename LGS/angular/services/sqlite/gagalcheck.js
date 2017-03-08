'use strict';
myAppModule.factory('GagalCheckSqliteServices', ["$rootScope","$http","$q","$filter","$window","$cordovaSQLite",
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

    var getGagalCheck = function (ID_AGENDA)
    {
        var deferred = $q.defer();
        var queryabsensi = 'SELECT * FROM GagalCheck WHERE ID_AGENDA = ? AND ISONSERVER = ?';
        $cordovaSQLite.execute($rootScope.db, queryabsensi, [ID_AGENDA,0])
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
    
    var setGagalCheck = function (isitable)
    {
       var deferred = $q.defer();
       var queryinsertgagalcheck = 'INSERT INTO GagalCheck (ID_AGENDA,USER_ID,ID_CUSTOMER,WAKTU_CHECK,TYPE_CHECK,POS_LAT,POS_LAG,ISONSERVER) VALUES (?,?,?,?,?,?,?,?)';
        $cordovaSQLite.execute($rootScope.db,queryinsertgagalcheck,isitable)
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

    var updateGagalCheck = function (isitable)
    {
        var deferred = $q.defer();
        var queryupdategagalcheck = 'UPDATE GagalCheck SET ISONSERVER = ? WHERE ID = ?';
        $cordovaSQLite.execute($rootScope.db,queryupdategagalcheck,isitable)
        .then(function(result) 
        {
            deferred.resolve(result);
        },
        function(error) 
        {
            deferred.rejected(error);
        });
        return deferred.promise; 
    }

    return{
            getGagalCheck:getGagalCheck,
            setGagalCheck:setGagalCheck,
            updateGagalCheck:updateGagalCheck
        }
}]);