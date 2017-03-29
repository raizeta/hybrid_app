angular.module('starter')
.factory('ProductFac',function($http, $q, $window,$rootScope,UtilService)
{
    var GetPureProducts = function(kodestore)
    {
        var deferred        = $q.defer();
        var globalurl       = UtilService.ApiUrl();
        var url             = globalurl + "efenbi-rasasayang/items";
        var method          = "GET";
        $http({method:method, url:url,cache:false})
        .success(function(response) 
        {
            deferred.resolve(response.Item);
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

    var GetProducts = function(kodestore)
    {
        var deferred        = $q.defer();
        var globalurl       = UtilService.ApiUrl();
        var url             = globalurl + "efenbi-rasasayang/item-groups?expand=formula&OUTLET_ID=" + kodestore;
        var method          = "GET";
        $http({method:method, url:url,cache:false})
        .success(function(response) 
        {
            deferred.resolve(response.ItemGroup);
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

    var GetProductsGroup = function(kodestore)
    {
        var deferred        = $q.defer();
        var globalurl       = UtilService.ApiUrl();
        var url             = globalurl + "efenbi-rasasayang/item-groups?expand=formula&OUTLET_ID=" + kodestore;
        var method          = "GET";
        $http({method:method, url:url,cache:false})
        .success(function(response) 
        {
            deferred.resolve(response.ItemGroup);
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
            GetPureProducts:GetPureProducts,
            GetProducts:GetProducts,
            GetProductsGroup:GetProductsGroup
        }
});