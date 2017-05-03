angular.module('starter')
.factory('TransaksiHeaderFac',function($http, $q, $window,$rootScope,UtilService)
{
    var GetTransaksiHeaders = function(TRANS_DATE,ACCESS_UNIX,OUTLET_ID,TOKEN)
    {
        var deferred            = $q.defer();
        var globalurl           = UtilService.ApiUrl();
        var url                 = globalurl + "kontrolgampang-transaksi/penjualan-headers";
        var params              = {};
        params['TRANS_DATE']    = TRANS_DATE;
        params['ACCESS_UNIX']   = ACCESS_UNIX;
        params['OUTLET_ID']     = OUTLET_ID;
        params['access-token']  = TOKEN;
        var method              = "GET";
        $http({method:method, url:url,params:params})
        .success(function(response) 
        {
            deferred.resolve(response.header);
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

    var SetTranskasiHeader = function(data)
    {
        var deferred            = $q.defer();
        var globalurl           = UtilService.ApiUrl();      
        var url                 = globalurl + "kontrolgampang-transaksi/penjualan-headers";

        var result              = UtilService.SerializeObject(data);
        var serialized          = result.serialized;
        var config              = result.config;

        $http.post(url,serialized,config)
        .success(function(data,status,headers,config) 
        {
            deferred.resolve(data);
        })
        .error(function(err,status)
        {
            deferred.reject(err);
        });
        return deferred.promise;  
    }

	return{
            GetTransaksiHeaders:GetTransaksiHeaders,
            SetTranskasiHeader:SetTranskasiHeader
        }
});