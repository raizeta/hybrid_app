angular.module('starter')
.factory('EmployeFac',function($http, $q, $window,$rootScope,UtilService)
{
    var GetEmploye  = function(OUTLET_CODE,access_token)
    {
        var deferred        = $q.defer();
        var globalurl       = UtilService.ApiUrl();
        var url             = globalurl + "kontrolgampang-hirs/employe-datas";
        var method          = "GET";
        var params                  = {};
        params['OUTLET_CODE']       = OUTLET_CODE;
        params['access-token']      = access_token;
        $http({method:method, url:url,params:params})
        .success(function(response) 
        {
            deferred.resolve(response.employee);
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

    var SetEmploye = function(data)
    {
        var deferred            = $q.defer();
        var globalurl           = UtilService.ApiUrl();      
        var url                 = globalurl + "kontrolgampang-hirs/employe-datas"

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

    var SetEmployeAbsensi = function(data)
    {
        var deferred            = $q.defer();
        var globalurl           = UtilService.ApiUrl();      
        var url                 = globalurl + "kontrolgampang-hirs/employe-absensis"

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

    var GetEmployeAbsensi  = function(OUTLET_CODE,access_token)
    {
        var deferred        = $q.defer();
        var globalurl       = UtilService.ApiUrl();
        var url             = globalurl + "kontrolgampang-hirs/employe-absensis";
        var method          = "GET";
        var params                  = {};
        params['OUTLET_CODE']       = OUTLET_CODE;
        params['access-token']      = access_token;
        $http({method:method, url:url,params:params})
        .success(function(response) 
        {
            deferred.resolve(response.employee);
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
            GetEmploye:GetEmploye,
            SetEmploye:SetEmploye,
            SetEmployeAbsensi:SetEmployeAbsensi,
            GetEmployeAbsensi:GetEmployeAbsensi
        }
});