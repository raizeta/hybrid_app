angular.module('starter')
.factory('SecuredFac',function($http, $q, $window,$rootScope,StorageService,UtilService)
{
	var userInfo;
    var Login = function(username,password,uuid)
    {
        var globalurl   = UtilService.ApiUrl();

        var deferred    = $q.defer();
        var username    = username;
        var password    = password;
        var url         = globalurl + "logintest/user-tokens" ;
        var method      = "GET";
        var params              = {};
        params['username']      = username;
        $http({method:method,url:url,params:params})
        .success(function(response) 
        {
            console.log(response);
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
                        UUID:response[0].UUID,
                        username:username
                    };
                    
                    deferred.resolve(userInfo);
                    StorageService.set("profile",userInfo);
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
            deferred.reject(err);
        });

        return deferred.promise;
    }

    var UserProfile = function(username,access_token)
    {
        var deferred            = $q.defer();
        var globalurl           = UtilService.ApiUrl();
        var url                 = globalurl + "logintest/users";
        var params              = {};
        params['username']      = username;
        params['access-token']  = access_token;
        $http({method:'GET',url:url,params:params })
        .success(function(response) 
        {
            if(angular.isDefined(response.User))
            {
                var dataprofile     = response.User[0];
                var advancedprofile = {}
                advancedprofile.ACCESS_UNIX   = dataprofile.ACCESS_UNIX;  
                advancedprofile.ACCESS_GROUP  = dataprofile.ACCESS_GROUP;
                advancedprofile.ACCESS_SITE   = dataprofile.ACCESS_SITE;
                advancedprofile.CORP_NM       = dataprofile.CORP_NM;
                advancedprofile.ONLINE        = dataprofile.ONLINE;
                advancedprofile.PROFILE_NM    = dataprofile.PROFILE_NM;
                advancedprofile.EMAIL         = dataprofile.email;
                advancedprofile.ID            = dataprofile.id;
                StorageService.set('advanced-profile',advancedprofile);
                deferred.resolve(advancedprofile); 
            }
            else
            {
                deferred.reject([])
            }
        },
        function(error,status)
        {
            deferred.reject(error);
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
            getUserInfo:getUserInfo,
            UserProfile:UserProfile
        }
});