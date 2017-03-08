'use strict';
myAppModule.factory('LamaKunjunganSqliteServices', ["$rootScope","$http","$q","$filter","$window","$cordovaSQLite",
function($rootScope,$http, $q, $filter, $window,$cordovaSQLite)
{
    var getLamaKunjungan= function (idagenda)
    {
        var deferred = $q.defer();
        var queryselectlamakunjungan = 'SELECT * FROM Lamakunjungan WHERE ID_AGENDA = ?';
        $cordovaSQLite.execute($rootScope.db, queryselectlamakunjungan, [idagenda])
        .then(function(result) 
        {
            if (result.rows.length > 0) 
            {
                var lamakunjungans = [];
                var l = result.rows.length;
                for (var i=0; i < l; i++) 
                {
                     var lamakunjungan = {};
                     lamakunjungan.ID_AGENDA                            = result.rows.item(i).ID_AGENDA;
                     lamakunjungan.WAKTU_MASUK                          = result.rows.item(i).WAKTU_MASUK;
                     lamakunjungan.WAKTU_KELUAR                         = result.rows.item(i).WAKTU_KELUAR;
                     lamakunjungans.push(lamakunjungan);
                }
                deferred.resolve(lamakunjungans);
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
    
    var setLamaKunjungan = function (isitable)
    {
       var deferred = $q.defer();
       var queryinsertlamakunjungan = 'INSERT INTO Lamakunjungan (ID_AGENDA,WAKTU_MASUK,WAKTU_KELUAR) VALUES (?,?,?)';
        $cordovaSQLite.execute($rootScope.db,queryinsertlamakunjungan,isitable)
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
            getLamaKunjungan:getLamaKunjungan,
            setLamaKunjungan:setLamaKunjungan
        }
}]);