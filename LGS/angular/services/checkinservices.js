'use strict';
myAppModule.factory('CheckInService', ["$rootScope","$http","$q","$filter","$window","LocationService",
function($rootScope,$http, $q, $filter, $window,LocationService)
{
	var getUrl = function()
	{
		return "http://api.lukisongroup.com/master";
	}
    
	var gettoken = function()
	{
		return "?access-token=azLSTAYr7Y7TLsEAML-LsVq9cAXLyAWa";
	}

    var setCheckinAction = function(ID_DETAIL,detail)
    {
        var url = getUrl();
        var deferred = $q.defer();

        $http.get(url + "/detailkunjungans/"+ ID_DETAIL)
        .success(function(data,status,headers,config) 
        {
            if(data.CHECKIN_TIME == null || data.CHECKIN_TIME == '' || data.CHECKIN_TIME == '0000-00-00 00:00:00')
            {
                var result              = $rootScope.seriliazeobject(detail);
                var serialized          = result.serialized;
                var config              = result.config;

                $http.put(url + "/detailkunjungans/"+ ID_DETAIL,serialized,config)
                .success(function(data,status,headers,config) 
                {
                    deferred.resolve(data);
                });
            }
            else
            {
                deferred.resolve(data);
            }    
        })
        .error(function(err,status)
        {
            if (status === 404)
            {
                deferred.resolve([]);
            }
            else    
            {
                deferred.reject(err);
            }
        });
        return deferred.promise;
    }
    
    var updateCheckinStatus = function(ID_DETAIL,statuskunjungan)
    {
        var url = getUrl();
        var deferred = $q.defer();
        $http.get(url + "/statuskunjungans/search?ID_DETAIL=" + ID_DETAIL)
        .success(function (response,status, headers, config) 
        {
            if(angular.isDefined(headers()['last-modified']))
            {
                console.log("Dari Cache");
                console.log("Update Status Check In");
            }
            else
            {
                if(angular.isDefined(response.statusCode))
                {
                   if(response.statusCode == 404)
                    {
                        var result              = $rootScope.seriliazeobject(statuskunjungan);
                        var serialized          = result.serialized;
                        var config              = result.config;

                        $http.post(url + "/statuskunjungans",serialized,config)
                        .success(function(data,status, headers, config) 
                        {
                            data.StatusAda = "BelumAda";
                            deferred.resolve(data);
                        });
                    } 
                }
                else
                {
                    response.StatusAda = "SudahAda";
                    deferred.resolve(response);
                }    
            }
              
        })
        .error(function (error)
        {
            deferred.reject(error);
        });
        return deferred.promise;
    }

    var getCheckinStatus = function(tanggalplan,auth)
    {
        var url = getUrl();
        var deferred = $q.defer();
        $http.get(url + "/statuskunjungans/search?TGL=" + tanggalplan + "&USER_ID=" + auth + "&CHECK_IN=1" + "&CHECK_OUT=0")
        .success(function(response,status, headers, config) 
        {
            if(angular.isDefined(response.statusCode))
            {
                deferred.resolve([]);
            }
            else
            {
              deferred.resolve(response.StatusKunjungan[0]);  
            }
            
        })
        .error(function(err,status)
        {
            if (status === 404)
            {
                deferred.resolve([]);
            }
            else    
            {
                deferred.reject(err);
            }

        });
        return deferred.promise;
    }
    
	return{
            setCheckinAction:setCheckinAction,
            updateCheckinStatus:updateCheckinStatus,
            getCheckinStatus:getCheckinStatus
		}
}]);