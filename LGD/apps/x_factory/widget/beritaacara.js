angular.module('starter')
.factory('BeritaAcaraFac',function($rootScope,$http,$q,$window,UtilService)
{
	var globalurl 		= UtilService.ApiUrl();
	var SearchBeritaAcara = function(statuscode)
    {
		var deferred 		= $q.defer();
		var url = globalurl + "/lgerp/beritaacaras/search?STATUS=" + statuscode;
		var method ="GET";
		$http({method:method, url:url,cache:false})
        .success(function(response) 
        {
	        deferred.resolve(response.BeritaAcara);
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
	var GetBeritaAcaras = function()
    {
		var deferred 		= $q.defer();
		var url = globalurl + "/lgerp/beritaacaras";
		var method ="GET";
		$http({method:method, url:url,cache:false})
        .success(function(response) 
        {
	        deferred.resolve(response.BeritaAcara);
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
    var GetBeritaAcara = function($id)
    {
		var deferred 		= $q.defer();
		var url 			= globalurl + "/lgerp/beritaacaras/" + $id;
		var method 			= "GET";
		$http({method:method, url:url,cache:false})
        .success(function(response) 
        {
	        deferred.resolve(response);
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
    var CreateBeritaAcara = function()
    {
		var deferred 		= $q.defer();
		var url = globalurl + "/lgerp/beritaacaras";
		var method ="POST";
		$http({method:method, url:url,cache:false})
        .success(function(response) 
        {
	        deferred.resolve(result);
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
    var UpdateBeritaAcara = function($idberitaacara)
    {
		var detail = {};

		var deferred 	= $q.defer();
		var url 		= globalurl + "/lgerp/beritaacaras/" + $idberitaacara;

		var serialize 	= UtilService.SerializeObject(detail);
		var serialized 	= serialize.serialized;
        var config		= serialize.config;

		$http.put(url,serialized,config)
        .success(function(data,status, headers, config) 
        {
            deferred.resolve(data);
        })	

        return deferred.promise;  
    }
    var DeleteBeritaAcara = function($idberitaacara)
    {
		var deferred 		= $q.defer();
		var url = globalurl + "/lgerp/beritaacaras/" + $idberitaacara;
		var method ="DELETE";
		$http({method:method, url:url,cache:false})
        .success(function(response) 
        {
	        deferred.resolve(response);
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
			SearchBeritaAcara:SearchBeritaAcara,
			GetBeritaAcaras:GetBeritaAcaras,
			GetBeritaAcara:GetBeritaAcara,
			CreateBeritaAcara:CreateBeritaAcara,
			UpdateBeritaAcara:UpdateBeritaAcara,
			DeleteBeritaAcara:DeleteBeritaAcara
		}
});