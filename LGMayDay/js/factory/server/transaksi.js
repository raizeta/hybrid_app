angular.module('starter')
.factory('TransaksiFac',function($http, $q, $window,$rootScope,UtilService,CloseBookLiteFac)
{
    var SetTranskasiClosing = function(datatosave)
    {
        var deferred            = $q.defer();
        var globalurl           = UtilService.ApiUrl();      
        var url                 = "http://api.lukisongroup.com/kontrolgampang-transaksi/penjualan-closing-buktis";

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

	return{
            SetTranskasiClosing:SetTranskasiClosing
        }
});