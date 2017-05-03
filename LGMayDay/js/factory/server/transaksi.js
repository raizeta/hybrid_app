angular.module('starter')
.factory('TransaksiFac',function($http, $q, $window,$rootScope,UtilService,CloseBookLiteFac)
{
    var SetTranskasiClosing = function(datatosave)
    {
        var deferred            = $q.defer();
        var globalurl           = UtilService.ApiUrl();      
        var url                 = globalurl + "kontrolgampang-transaksi/penjualan-closing-buktis";

        var result              = UtilService.SerializeObject(datatosave);
        var serialized          = result.serialized;
        var config              = result.config;

        $http.post(url,serialized,config)
        .success(function(dataresponse,status,headers,config) 
        {
            deferred.resolve(dataresponse);
            datatosave.IS_ONSERVER = 1;
            CloseBookLiteFac.UpdateIsOnServerSetoranBook(datatosave);
        })
        .error(function(err,status)
        {
            deferred.reject(err);
        });
        return deferred.promise;  
    }
    var GetTransaksiClosing = function(STORAN_DATE,ACCESS_UNIX,OUTLET_ID,TOKEN)
    {
        var deferred            = $q.defer();
        var globalurl           = UtilService.ApiUrl();
        var url                 = globalurl + "kontrolgampang-transaksi/penjualan-closing-buktis";
        var params              = {};
        params['STORAN_DATE']   = STORAN_DATE;
        params['ACCESS_UNIX']   = ACCESS_UNIX;
        params['OUTLET_ID']     = OUTLET_ID;
        params['access-token']  = TOKEN;
        var method              = "GET";
        $http({method:method, url:url,params:params})
        .success(function(response) 
        {
            deferred.resolve(response.detail);
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

	return{
            SetTranskasiClosing:SetTranskasiClosing,
            GetTransaksiClosing:GetTransaksiClosing
        }
});