angular.module('starter')
.factory('SecuredFac',function($http, $q, $window,$rootScope,StorageService,UtilService)
{
	var userInfo;
    var Login = function(username,password,uuid)
    {
        var urla = UtilService.ApiUrl();

        var deferred    = $q.defer();
        var username    = username;
        var password    = password;
        var url         = "http://api.lukisongroup.com/logintest/user-tokens";
        var method      = "GET";
        $http({method:method,url:url,params:{'username':username}})
        .success(function(response) 
        {
            if(angular.isDefined(response.statusCode))
            {
               if(response.statusCode == 404 || response.statusCode == 204)
                {
                    deferred.resolve("username_salah");
                }
            }
            else
            {
                if(angular.isArray(response) && response.length > 0)
                {
                    userInfo = 
                    {
                        access_token: response[0].access_token,
                        ACCESS_UNIX: response[0].ACCESS_UNIX,
                        UUID:response[0].UUID
                    };
                    
                    deferred.resolve(userInfo);
                    $window.localStorage.setItem("profile", JSON.stringify(userInfo));
                }
            } 
        })
        .error(function(err,status)
        {
            if(angular.isDefined(err.code))
            {
                if(err.code == 8 || err.code =='8')
                {
                    deferred.reject("username_salah");
                }
            }
            else
            {
                deferred.reject("jaringan");
            }
        });

        return deferred.promise;
    }
    var getUserInfo = function() 
    {
        return userInfo;
    }
    
    var init = function() 
    {
        if(window.localStorage.getItem("profile")) 
        {
            userInfo = JSON.parse($window.localStorage.getItem("profile"));
        }
    }
    init();

	return{
            Login:Login,
            getUserInfo:getUserInfo
        }
});