angular.module('starter')
.factory('ProductCombFac',function($rootScope,$http,$q,$filter,$cordovaSQLite,ProductLiteFac,ProductFac)
{
    var GetPureProductComb  = function ()
    {
        var deferred        = $q.defer();
        ProductLiteFac.GetPureProducts()
        .then(function(responselite)
        {
            if(angular.isArray(responselite) && responselite.length > 0)
            {
                deferred.resolve(responselite)
            }
            else
            {
                ProductFac.GetPureProducts()
                .then(function(responseserver)
                {
                    if(angular.isArray(responseserver) && responseserver.length > 0 )
                    {
                        angular.forEach(responseserver,function(value,key)
                        {
                            ProductLiteFac.SetPureProduct(value);
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
    var GetPureProductGroupComb  = function (OUTLET_ID)
    {
        var deferred        = $q.defer();
        ProductLiteFac.GetProductsGroup(OUTLET_ID)
        .then(function(responselite)
        {
            if(angular.isArray(responselite) && responselite.length > 0)
            {
                deferred.resolve(responselite)
            }
            else
            {
                ProductFac.GetProductsGroup(OUTLET_ID)
                .then(function(responseserver)
                {
                    if(angular.isArray(responseserver) && responseserver.length > 0 )
                    {
                        angular.forEach(responseserver,function(value,key)
                        {
                            ProductLiteFac.SetProductsGroup(value);
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
            GetPureProductComb:GetPureProductComb,
            GetPureProductGroupComb:GetPureProductGroupComb
        }
});