angular.module('starter')
.factory('PekerjaFac',function($rootScope,$http,$q,$window,UtilService)
{
	
	var GetPekerja = function(ID_PEKERJA)
    {
		var deferred 		   = $q.defer();
		// var url 			= "http://rt.kontrolgampang.com/login/user-tokens?username=x&email=piter@x.com";
		var url 			    = "http://rt.kontrolgampang.com/master/pekerjas";
		var method 			    = "GET";
		var params 			    = {};
		params["ID_PEKERJA"]	= ID_PEKERJA;
		$http({method:method, url:url,params:params,cache:true})
        .success(function(response) 
        {
	        deferred.resolve(response.pekerja);
        })
        .error(function(err,status)
        {
	        deferred.reject(err);
        });	

        return deferred.promise;  
    }
    return {
    	GetPekerja:GetPekerja
    }
});