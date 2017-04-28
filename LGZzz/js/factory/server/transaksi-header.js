angular.module('starter')
.factory('TransaksiHeaderFac',function($http, $q, $window,$rootScope,UtilService)
{
    var GetTransaksiHeaders = function(TGL_SAVE,ACCESS_UNIX,OUTLET_ID)
    {
        var deferred            = $q.defer();
        var globalurl           = UtilService.ApiUrl();
        var url                 = "http://api.lukisongroup.com/kontrolgampang-transaksi/penjualan-headers";
        var params              = {};
        params['TGL_SAVE']      = TGL_SAVE;
        params['ACCESS_UNIX']   = ACCESS_UNIX;
        params['OUTLET_ID']     = OUTLET_ID;
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
        var url                 = "http://api.lukisongroup.com/kontrolgampang-transaksi/penjualan-headers";

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