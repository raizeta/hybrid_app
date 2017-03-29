angular.module('starter')
.factory('TransaksiHeaderFac',function($http, $q, $window,$rootScope,UtilService)
{
    var GetTransaksiHeaders = function(kodestore,tanggalsekarang,transtype)
    {
        var deferred        = $q.defer();
        var globalurl       = UtilService.ApiUrl();
        // var url             = globalurl + "efenbi-rasasayang/transaksis";
        var url             = globalurl + "efenbi-rasasayang/transaksi-headers?OUTLET_ID=" + kodestore + "&TRANS_DATE="+ tanggalsekarang +"&TRANS_TYPE=" + transtype;
        var method          = "GET";
        $http({method:method, url:url,cache:false})
        .success(function(response) 
        {
            deferred.resolve(response.transaksi);
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
        var url                 = globalurl + "efenbi-rasasayang/transaksi-headers";

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