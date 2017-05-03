angular.module('starter')
.factory('TransaksiCombFac',function($rootScope,$http,$q,$filter,$cordovaSQLite,TransaksiHeaderFac,TransCustLiteFac,TransaksiFac,CloseBookLiteFac)
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

    var GetSetoranBookComb = function(STORAN_DATE,ACCESS_UNIX,OUTLET_ID,STATUS,IS_ONSERVER,TOKEN)
    {
        var deferred        = $q.defer();
        CloseBookLiteFac.GetSetoranBook()
        .then(function(responsegetsetoranbooklocal)
        {
            if(angular.isArray(responsegetsetoranbooklocal) && responsegetsetoranbooklocal.length > 0)
            {
                deferred.resolve(responsegetsetoranbooklocal)
            }
            else
            {
                TransaksiFac.GetTransaksiClosing(STORAN_DATE,ACCESS_UNIX,OUTLET_ID,TOKEN)
                .then(function(responsesetoranbookserver)
                {
                    if(angular.isArray(responsesetoranbookserver) && responsesetoranbookserver.length > 0 )
                    {
                        angular.forEach(responsesetoranbookserver,function(value,key)
                        {
                            value.OUTLET_CODE   = value.OUTLET_ID;
                            value.STATUS        = 1;
                            value.IS_ONSERVER   = 1;
                            CloseBookLiteFac.SetSetoranBook(value);
                        });
                        deferred.resolve(responsesetoranbookserver);
                    }
                    else
                    {
                        deferred.resolve([]);
                    }
                })
            }
        });
        return deferred.promise;

    }
        
    return{
            GetTransCustsHeaderComb:GetTransCustsHeaderComb,
            GetSetoranBookComb:GetSetoranBookComb
        }
});