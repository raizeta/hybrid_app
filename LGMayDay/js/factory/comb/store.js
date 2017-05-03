angular.module('starter')
.factory('StoreCombFac',function($rootScope,$http,$q,$filter,$cordovaSQLite,StoreLiteFac,StoreFac)
{
    var GetStoreComb  = function (ACCESS_UNIX,access_token)
    {
        var deferred        = $q.defer();
        StoreLiteFac.GetStore()
        .then(function(responselite)
        {
            if(angular.isArray(responselite) && responselite.length > 0)
            {
                deferred.resolve(responselite)
            }
            else
            {
                StoreFac.GetBearerStores(ACCESS_UNIX,access_token)
                .then(function(responseserver)
                {
                    if(angular.isArray(responseserver) && responseserver.length > 0 )
                    {
                        angular.forEach(responseserver,function(value,key)
                        {
                            value.IS_ONSERVER   = 1;
                            StoreLiteFac.SetStore(value);
                        });
                        deferred.resolve(responseserver);
                    }
                    else
                    {
                        deferred.resolve([]);
                    }
                },
                function(error)
                {
                    deferred.reject(error);
                });
            }
        });
        return deferred.promise;
    }
        
    return{
            GetStoreComb:GetStoreComb
        }
});