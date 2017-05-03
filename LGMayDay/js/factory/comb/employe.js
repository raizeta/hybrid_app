angular.module('starter')
.factory('EmployeCombFac',function($rootScope,$http,$q,$filter,$cordovaSQLite,EmployeLiteFac,EmployeFac)
{
    var GetEmployeComb  = function (OUTLET_CODE,access_token)
    {
        var OUTLET_CODE     = OUTLET_CODE;
        var access_token    = access_token;
        var deferred        = $q.defer();
        EmployeLiteFac.GetEmploye(OUTLET_CODE)
        .then(function(responselite)
        {
            if(angular.isArray(responselite) && responselite.length > 0)
            {
                deferred.resolve(responselite)
            }
            else
            {
                EmployeFac.GetEmploye(OUTLET_CODE,access_token)
                .then(function(responseserver)
                {
                    if(angular.isArray(responseserver) && responseserver.length > 0 )
                    {
                        angular.forEach(responseserver,function(value,key)
                        {
                            value.IS_ONSERVER = 1;
                            EmployeLiteFac.SetEmploye(value);
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
            GetEmployeComb:GetEmployeComb
        }
});