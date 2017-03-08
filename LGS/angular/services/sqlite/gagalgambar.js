'use strict';
myAppModule.factory('GagalGambarSqliteServices', ["$rootScope","$http","$q","$filter","$window","$cordovaSQLite",
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

    var getGagalGambar = function (ID_AGENDA)
    {
        var deferred = $q.defer();
        var queryabsensi = 'SELECT * FROM GagalGambar WHERE ID_AGENDA = ? AND ISONSERVER = ?';
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
    
    var setGagalGambar = function (isitable)
    {
       var deferred = $q.defer();
       var queryinsertgagalgambar = 'INSERT INTO GagalGambar (ID_AGENDA,USER_ID,ID_CUSTOMER,WAKTU_GAMBAR,TYPE_GAMBAR,ISI_GAMBAR,ISONSERVER) VALUES (?,?,?,?,?,?,?)';
        $cordovaSQLite.execute($rootScope.db,queryinsertgagalgambar,isitable)
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

    var updateGagalGambar = function (isitable)
    {
        var deferred = $q.defer();
        var queryupdategagalgambar = 'UPDATE GagalGambar SET ISONSERVER = ? WHERE ID = ?';
        $cordovaSQLite.execute($rootScope.db,queryupdategagalgambar,isitable)
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
            getGagalGambar:getGagalGambar,
            setGagalGambar:setGagalGambar,
            updateGagalGambar:updateGagalGambar
        }
}]);