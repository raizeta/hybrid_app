angular.module('starter')
.factory('StoreCombFac',function($rootScope,$http,$q,$filter,$cordovaSQLite,StoreLiteFac,StoreFac)
{
    var GetPureStoreComb  = function ()
    {
        var deferred        = $q.defer();
        StoreLiteFac.GetPureStores()
        .then(function(responselite)
        {
            if(angular.isArray(responselite) && responselite.length > 0)
            {
                deferred.resolve(responselite)
            }
            else
            {
                StoreFac.GetPureStores()
                .then(function(responseserver)
                {
                    if(angular.isArray(responseserver) && responseserver.length > 0 )
                    {
                        angular.forEach(responseserver,function(value,key)
                        {
                            StoreLiteFac.SetPureStore(value);
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
            GetPureStoreComb:GetPureStoreComb
        }
});