angular.module('starter')
.factory('BeritaAcaraKomentarFac',function($rootScope,$http,$q,$window,UtilService)
{
	var globalurl 		= UtilService.ApiUrl();
	var SearchBeritaAcaraKomentars = function(KD_BERITA)
    {
		var deferred 		= $q.defer();
		var url = globalurl + "/lgerp/beritaacarakomentars/search?KD_BERITA=" + KD_BERITA;
		var method ="GET";
		$http({method:method, url:url,cache:false})
        .success(function(response) 
        {
	        deferred.resolve(response.BeritaAcaraKomentar);
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
	var GetBeritaAcaraKomentars = function()
    {
		var deferred 		= $q.defer();
		var url = globalurl + "/lgerp/beritaacarakomentars";
		var method ="GET";
		$http({method:method, url:url,cache:false})
        .success(function(response) 
        {
	        deferred.resolve(response.BeritaAcaraKomentar);
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
    var GetBeritaAcaraKomentar = function($id)
    {
		var deferred 		= $q.defer();
		var url 			= globalurl + "/lgerp/beritaacarakomentars/" + $id;
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
    var CreateBeritaAcaraKomentar = function()
    {
		var deferred 		= $q.defer();
		var url = globalurl + "/lgerp/beritaacarakomentars";
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
    var UpdateBeritaAcaraKomentar = function($idberitaacara)
    {
		var detail = {};

		var deferred 	= $q.defer();
		var url 		= globalurl + "/lgerp/beritaacarakomentars/" + $idberitaacara;

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
    var DeleteBeritaAcaraKomentar = function($idberitaacara)
    {
		var deferred 		= $q.defer();
		var url = globalurl + "/lgerp/beritaacarakomentars/" + $idberitaacara;
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
			SearchBeritaAcaraKomentars:SearchBeritaAcaraKomentars,
			GetBeritaAcaraKomentars:GetBeritaAcaraKomentars,
			GetBeritaAcaraKomentar:GetBeritaAcaraKomentar,
			CreateBeritaAcaraKomentar:CreateBeritaAcaraKomentar,
			UpdateBeritaAcaraKomentar:UpdateBeritaAcaraKomentar,
			DeleteBeritaAcaraKomentar:DeleteBeritaAcaraKomentar
		}
});