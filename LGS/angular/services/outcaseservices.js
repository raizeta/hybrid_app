'use strict';
myAppModule.factory('OutCaseService', ["$rootScope","$http","$q","$filter","$window","LocationService",
function($rootScope,$http, $q, $filter, $window,LocationService)
{
    var tanggalsekarang = $filter('date')(new Date(),'yyyy-MM-dd');
    var getUrl = function()
	{
		return "http://api.lukisongroup.com/master";
	}
	var gettoken = function()
	{
		return "?access-token=azLSTAYr7Y7TLsEAML-LsVq9cAXLyAWa";
	}	

	var SetOutOfCases = function(detail)
    {
        var globalurl = getUrl();
        var deferred = $q.defer();

        var result              = $rootScope.seriliazeobject(detail);
        var serialized          = result.serialized;
        var config              = result.config;

        $http.post(globalurl + "/outofcases",serialized,config)
        .success(function(data,status,headers,config) 
        {
            deferred.resolve(data);
        })
        .error(function(err,status)
        {
            if (status === 404)
            {
                deferred.reject(err);
            }
            else    
            {
                deferred.reject(err);
            }

        });
        return deferred.promise; 
    }
    var SetHeaderOutOfCases = function(detail)
    {
        var globalurl = getUrl();
        var deferred = $q.defer();

        var result              = $rootScope.seriliazeobject(detail);
        var serialized          = result.serialized;
        var config              = result.config;

        $http.post(globalurl + "/jadwalkunjungans",serialized,config)
        .success(function(data,status,headers,config) 
        {
            deferred.resolve(data);
        })
        .error(function(err,status)
        {
            if (status === 404)
            {
                deferred.reject(err);
            }
            else    
            {
                deferred.reject(err);
            }

        });
        return deferred.promise; 
    }

	return{
            SetOutOfCases:SetOutOfCases,
            SetHeaderOutOfCases:SetHeaderOutOfCases
		}
}]);