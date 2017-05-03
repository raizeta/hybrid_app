angular.module('starter')
.factory('CustomerFac',function($http, $q, $window,$rootScope,UtilService,CustomerLiteFac)
{
    var GetCustomer  = function(ACCESS_UNIX,OUTLET_CODE,access_token)
    {
        var deferred        = $q.defer();
        var globalurl       = UtilService.ApiUrl();
        var url             = "http://api.lukisongroup.com/kontrolgampang-master/customers";
        var method          = "GET";
        var params                  = {};
        params['ACCESS_UNIX']       = ACCESS_UNIX;
        params['OUTLET_CODE']       = OUTLET_CODE;
        params['access-token']      = access_token;
        $http({method:method, url:url,params:params})
        .success(function(response) 
        {
            deferred.resolve(response.customer);
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

    var SetCustomer = function(datacustomer)
    {
        var deferred            = $q.defer();
        var globalurl           = UtilService.ApiUrl();      
        var url                 = "http://api.lukisongroup.com/kontrolgampang-master/customers"

        var result              = UtilService.SerializeObject(datacustomer);
        var serialized          = result.serialized;
        var config              = result.config;

        $http.post(url,serialized,config)
        .success(function(dataresponse,status,headers,config) 
        {
            var datatoupdate    = [1,dataresponse.ACCESS_UNIX,dataresponse.OUTLET_CODE,dataresponse.NAME]
            CustomerLiteFac.UpdateCustomerIsOnServer(datatoupdate)
            .then(function(responseupdateisonserver)
            {
                console.log("Sukses Update Customer Is On Server");
            });
            deferred.resolve(dataresponse);
        })
        .error(function(err,status)
        {
            deferred.reject(err);
        });
        return deferred.promise;  
    }

	return{
            GetCustomer:GetCustomer,
            SetCustomer:SetCustomer
        }
});