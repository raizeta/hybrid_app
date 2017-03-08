'use strict';
myAppModule.factory('ConfigradiusSqlite', ["$rootScope","$http","$q","$filter","$window","$cordovaSQLite",
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

    var GetConfigradiusSqlite = function ()
    {
        var deferred            = $q.defer();
        var TGL                 = $filter('date')(new Date(),'yyyy-MM-dd');
        var queryconfigradius   = 'SELECT * FROM Configradius WHERE TGL= ?';
        $cordovaSQLite.execute($rootScope.db, queryconfigradius, [TGL])
        .then(function(result) 
        {
            if (result.rows.length > 0) 
            {
                var resultconfigradius = [];
                var l = result.rows.length;
                for (var i=0; i < l; i++) 
                {
                    var radius = {};
                    radius.ID_SERVER                            = result.rows.item(i).ID_SERVER;
                    radius.checkin                              = result.rows.item(i).CHECKIN;
                    radius.valueradius                          = result.rows.item(i).VALUERADIUS;
                    radius.note                                 = result.rows.item(i).NOTE;
                    resultconfigradius.push(radius);
                }
                deferred.resolve(resultconfigradius);
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
    
    var GetConfigRadiusFromServer = function()
    { 
        var globalurl       = getUrl();
        var deferred        = $q.defer();
        var url = globalurl + "/configurations/search?statusaktif=1";
        var method ="GET";
        $http({method:method, url:url,cache:true})
        .success(function(response) 
        {
            if(angular.isDefined(response.statusCode))
            {
                deferred.resolve([]);
            }
            else if(angular.isDefined(response.Configuration))
            {
                angular.forEach(response.Configuration, function(value,key)
                {
                    var newID_SERVER        = value.id;
                    var newCHECKIN          = value.checkin;
                    var newVALUERADIUS      = value.valueradius;
                    var newNOTE             = value.note;
                    var newTGL              = $filter('date')(new Date(),'yyyy-MM-dd');
                    var isitable            = [newID_SERVER,newCHECKIN,newVALUERADIUS,newNOTE,newTGL];
                    var queryconfigradius = 'INSERT INTO Configradius (ID_SERVER,CHECKIN,VALUERADIUS,NOTE,TGL) VALUES (?,?,?,?,?)';
                    $cordovaSQLite.execute($rootScope.db,queryconfigradius,isitable)
                    .then(function(result)
                    {
                        console.log("Sukses Save Config Radius");
                    },
                    function (error)
                    {
                        console.log("Gagal Save Config Radius");
                    });

                });
                deferred.resolve(response.Configuration); 
            }
        })
        .error(function(err,status)
        {
            deferred.reject(err);
        }); 

        return deferred.promise;
    }

    return{
            GetConfigradiusSqlite:GetConfigradiusSqlite,
            GetConfigRadiusFromServer:GetConfigRadiusFromServer
        }
}]);