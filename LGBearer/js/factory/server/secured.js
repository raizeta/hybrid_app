angular.module('starter')
.factory('SecuredFac',function($http, $q, $window,$rootScope,UtilService)
{
	var userInfo;
    var Login = function(username,password,uuid)
    {
        var urla = UtilService.ApiUrl();

        var deferred = $q.defer();
        var username = username;
        var password = password;
        var url      = "http://api.lukisongroup.com/logintest/user-tokens?username=trial1";
        // var url      = "http://api.lukisongroup.com/logintest/user-tokens?username=trial1";
        http://api.lukisongroup.com/logintest/users
        var method   = "GET";

        $http({method:method,url:url})
        .success(function(response) 
        {
            console.log(response);
            if(angular.isDefined(response.statusCode))
            {
               if(response.statusCode == 404)
                {
                    deferred.resolve("username_salah");
                }
            }
            else
            {
                console.log(response);
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