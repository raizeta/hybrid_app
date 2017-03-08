'use strict';
myAppModule.factory('AbsensiSqliteServices', ["$rootScope","$http","$q","$filter","$window","$cordovaSQLite",
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

    var getAbsensi = function (tanggalplan,userid)
    {
        var deferred = $q.defer();
        var queryabsensi = 'SELECT * FROM Absensi WHERE TGL = ? AND USER_ID = ?';
        $cordovaSQLite.execute($rootScope.db, queryabsensi, [tanggalplan, userid])
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
    
    var setAbsensi = function (isitable)
    {
       var deferred = $q.defer();
       var queryinsertabsensi = 'INSERT INTO Absensi (ID_SERVER,TGL,USER_ID,USER_NM,WAKTU_MASUK,WAKTU_KELUAR,STATUS_ABSENSI,ISON_SERVER) VALUES (?,?,?,?,?,?,?,?)';
        $cordovaSQLite.execute($rootScope.db,queryinsertabsensi,isitable)
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

    var updateAbsensi = function (isitable)
    {
        var deferred = $q.defer();
        var queryupdateabsensi = 'UPDATE Absensi SET WAKTU_KELUAR = ?, STATUS_ABSENSI = ?, ISON_SERVER = ? WHERE ID_SERVER = ?';
        $cordovaSQLite.execute($rootScope.db,queryupdateabsensi,isitable)
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

    var getAbsensiStatus = function (tanggalplan,userid)
    {
        var deferred = $q.defer();
        var queryabsensi = 'SELECT * FROM Absensi WHERE TGL = ? AND USER_ID = ?';
        $cordovaSQLite.execute($rootScope.db, queryabsensi, [tanggalplan, userid])
        .then(function(result) 
        {
            var resultabsensi = {};
            if (result.rows.length > 0) 
            {
                var statusabsensi           = result.rows.item(0).STATUS_ABSENSI;
                if(statusabsensi == 0)
                {
                    resultabsensi.statusabsensi = 0;
                }
                else
                {
                    resultabsensi.statusabsensi = 1;
                }
            }
            else
            {
                resultabsensi.statusabsensi = 3;
            }
            deferred.resolve(resultabsensi);
        });
        return deferred.promise;
    }

    return{
            getAbsensi:getAbsensi,
            setAbsensi:setAbsensi,
            updateAbsensi:updateAbsensi,
            getAbsensiStatus:getAbsensiStatus
        }
}]);