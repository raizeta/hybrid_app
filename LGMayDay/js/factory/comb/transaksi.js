angular.module('starter')
.factory('TransaksiCombFac',function($rootScope,$http,$q,$filter,$cordovaSQLite,TransaksiHeaderFac,TransCustLiteFac)
{
    var GetTransCustsHeaderComb = function (TRANS_DATE,ACCESS_UNIX,OUTLET_ID,TOKEN)
    {
        var deferred        = $q.defer();
        TransCustLiteFac.GetTransCustsHeader(TRANS_DATE,ACCESS_UNIX,OUTLET_ID)
        .then(function(responselite)
        {
            if(angular.isArray(responselite) && responselite.length > 0)
            {
                deferred.resolve(responselite)
            }
            else
            {
                TransaksiHeaderFac.GetTransaksiHeaders(TRANS_DATE,ACCESS_UNIX,OUTLET_ID,TOKEN)
                .then(function(responseserver)
                {
                    if(angular.isArray(responseserver) && responseserver.length > 0 )
                    {
                        angular.forEach(responseserver,function(value,key)
                        {
                            value.ID_SERVER     = value.ID;
                            value.STATUS_BUY    = 'COMPLETE';
                            value.IS_ONSERVER   = 1;
                            TransCustLiteFac.SetTransCustsHeader(value);
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
            GetTransCustsHeaderComb:GetTransCustsHeaderComb
        }
});