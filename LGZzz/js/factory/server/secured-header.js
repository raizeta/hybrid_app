angular.module('starter')
.factory('SecuredFac',function($http, $q, $window,$rootScope,UtilService)
{
	var userInfo;
    var Login = function(username,password)
    {
        var detail = {};
        detail.username = username;
        detail.password = password;
        var deferred = $q.defer();
        var urla = UtilService.ApiUrl();

        var result              = UtilService.SerializeObject(detail);
        var serialized          = result.serialized;
        var config              = result.config;

        var url = "http://zetashop.herokuapp.com/api/login_check";
        $http.post(url,serialized,config)
        .success(function(response) 
        {
            console.log(response);
            userInfo = 
            {
                accessToken : response.token,
                username    : response.data.username,
                role        : response.data.roles
            };
            deferred.resolve(userInfo);
            $window.localStorage.setItem("profile", JSON.stringify(userInfo));
        })
        .error(function(err,status)
        {
            deferred.reject(err);
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