angular.module('starter')
.factory('StoreFac',function($http, $q, $window,$rootScope,UtilService)
{
    var GetPureStores = function()
    {
        var deferred        = $q.defer();
        var globalurl       = UtilService.ApiUrl();
        var url             = globalurl + "efenbi-rasasayang/stores";
        var method          = "GET";
        $http({method:method, url:url,cache:false,headers: {'Authorization': undefined}})
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

    var GetBearerStores = function(ACCESS_UNIX,access_token)
    {
        var deferred                = $q.defer();
        var globalurl               = UtilService.ApiUrl();
        var url                     = "http://api.lukisongroup.com/kontrolgampang-master/stores";
        var method                  = "GET";
        var params                  = {};
        params['ACCESS_UNIX']       = ACCESS_UNIX;
        params['access-token']      = access_token;
        $http({method:method, url:url,params:params })
        .success(function(response) 
        {
            if(angular.isDefined(response.store))
            {
                deferred.resolve(response.store);
            }
            else
            {
                deferred.resolve([]);   
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

    var GetBearerStoresItem = function(ACCESS_UNIX,access_token)
    {
        var deferred                = $q.defer();
        var globalurl               = UtilService.ApiUrl();
        var url                     = "http://api.lukisongroup.com/kontrolgampang-master/stores";
        var method                  = "GET";
        var params                  = {};
        params['ACCESS_UNIX']       = ACCESS_UNIX;
        params['access-token']      = access_token;
        params['expand']            = 'items';
        $http({method:method, url:url,params:params })
        .success(function(response) 
        {
            if(angular.isDefined(response.store))
            {
                deferred.resolve(response.store);
            }
            else
            {
                deferred.resolve([]);   
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
            GetPureStores:GetPureStores,
            GetBearerStores:GetBearerStores,
            GetBearerStoresItem:GetBearerStoresItem
        }
});