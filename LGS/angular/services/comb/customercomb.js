'use strict';
myAppModule.factory('CustomerCombFac',
function($rootScope,$http,$q,$filter,$cordovaSQLite,CustomerSqliteFac,CustomerFac)
{
    var GetCustomerCombine  = function ()
    {
        var deferred        = $q.defer();
        CustomerSqliteFac.GetCustomers()
        .then(function(responselocal)
        {
            if(angular.isArray(responselocal) && responselocal.length > 0)
            {
                deferred.resolve(responselocal)
            }
            else
            {
                CustomerFac.GetCustomers()
                .then(function(responseserver)
                {
                    if(angular.isArray(responseserver) && responseserver.length > 0 )
                    {
                        angular.forEach(responseserver,function(value,key)
                        {
                            CustomerSqliteFac.SetCustomers(value);
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
            GetCustomerCombine:GetCustomerCombine
        }
});