angular.module('starter')
.factory('StoreFac',function($http, $q, $window,$rootScope,UtilService)
{
    var GetStores = function()
    {
        var deferred        = $q.defer();
        var globalurl       = UtilService.ApiUrl();
        var url             = globalurl + "efenbi-rasasayang/stores";
        var method          = "GET";
        $http({method:method, url:url,cache:false})
        .success(function(response) 
        {
            deferred.resolve(response.Store);
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
            GetStores:GetStores
        }
});