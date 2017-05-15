angular.module('starter')
.factory('SecuredFac',function($rootScope,$http,$q,$window,UtilService)
{
	
	var GetProfileLogin = function(username,email)
    {
		var deferred 		= $q.defer();
		// var url 			= "http://rt.kontrolgampang.com/login/user-tokens?username=x&email=piter@x.com";
		var url 			= "http://rt.kontrolgampang.com/login/user-tokens";
		var method 			= "GET";
		var params 			= {};
		params["username"]	= username;
		params["email"]		= '';
		$http({method:method, url:url,params:params})
        .success(function(response) 
        {
	        deferred.resolve(response);
        })
        .error(function(err,status)
        {
	        deferred.reject(err);
        });	

        return deferred.promise;  
    }
    var SetProfileLogin = function(datatosave)
    {
        var deferred            = $q.defer();
        var globalurl           = UtilService.ApiUrl();      
        var url                 = "http://rt.kontrolgampang.com/login/user-tokens";

        var result              = UtilService.SerializeObject(datatosave);
        var serialized          = result.serialized;
        var config              = result.config;

        $http.post(url,serialized,config)
        .success(function(dataresponse,status,headers,config) 
        {
            deferred.resolve(dataresponse);
        })
        .error(function(err,status)
        {
            deferred.reject(err);
        });
        return deferred.promise;  
    }
    return {
    	GetProfileLogin:GetProfileLogin,
    	SetProfileLogin:SetProfileLogin
    }
});