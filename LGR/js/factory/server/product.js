angular.module('starter')
.factory('ProductFac',function($http, $q, $window,$rootScope,UtilService)
{
    var GetProducts = function(username,password,uuid)
    {
        var deferred        = $q.defer();
        var globalurl       = UtilService.ApiUrl();
        var url             = globalurl + "efenbi-rasasayang/item-groups?OUTLET_ID=0001";
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
            GetProducts:GetProducts
        }
});