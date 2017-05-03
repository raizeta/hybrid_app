angular.module('starter')
.factory('TransaksiDetailFac',function($http, $q, $window,$rootScope,UtilService)
{
    var SetTranskasiDetail = function(data)
    {
        var deferred            = $q.defer();
        var globalurl           = UtilService.ApiUrl();      
        var url                 = globalurl + "kontrolgampang-transaksi/penjualan-details";

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

    var SetTranskasiClosing = function(data)
    {
        var deferred            = $q.defer();
        var globalurl           = UtilService.ApiUrl();      
        var url                 = globalurl + "kontrolgampang-transaksi/penjualan-closing-buktis";

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
            SetTranskasiDetail:SetTranskasiDetail,
            SetTranskasiClosing:SetTranskasiClosing
        }
});