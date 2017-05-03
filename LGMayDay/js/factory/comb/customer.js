angular.module('starter')
.factory('CustomerCombFac',function($rootScope,$http,$q,$filter,$cordovaSQLite,CustomerLiteFac,CustomerFac)
{
    var GetCustomerComb  = function (ACCESS_UNIX,OUTLET_CODE,access_token)
    {
        var ACCESS_UNIX     = ACCESS_UNIX;
        var OUTLET_CODE     = OUTLET_CODE;
        var access_token    = access_token;
        var deferred        = $q.defer();
        CustomerLiteFac.GetCustomer(ACCESS_UNIX,OUTLET_CODE)
        .then(function(responselite)
        {
            if(angular.isArray(responselite) && responselite.length > 0)
            {
                deferred.resolve(responselite)
            }
            else
            {
                CustomerFac.GetCustomer(ACCESS_UNIX,OUTLET_CODE,access_token)
                .then(function(responseserver)
                {
                    if(angular.isArray(responseserver) && responseserver.length > 0 )
                    {
                        angular.forEach(responseserver,function(value,key)
                        {
                            
                            value.TGL_SAVE      = $filter('date')(new Date(),'yyyy-MM-dd');
                            value.IS_ONSERVER   = 1;
                            CustomerLiteFac.SetCustomer(value);
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
            GetCustomerComb:GetCustomerComb
        }
});