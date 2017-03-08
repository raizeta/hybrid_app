angular.module('starter')
.factory('TipeBarangService',function($rootScope,$http, $q, $window,UtilService)
{
	var globalurl 		= UtilService.ApiUrl();
	var GetTipeBarangs = function()
    {
		var deferred 		= $q.defer();
		var url = globalurl + "/tipebarangs";
		var method ="GET";
		$http({method:method, url:url,cache:true})
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
    var GetTipeBarang = function($id)
    {
		var deferred 		= $q.defer();
		var url = globalurl + "/" + $id;
		var method ="GET";
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
    var CreateTipeBarang = function()
    {
		var deferred 		= $q.defer();
		var url = globalurl + "";
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
    var UpdateTipeBarang = function($id)
    {
		var deferred 		= $q.defer();
		var url = globalurl + "" + $id;
		var method ="PUT";
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
    var DeleteTipeBarang = function($id)
    {
		var deferred 		= $q.defer();
		var url = globalurl + "" + $id;
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
			GetTipeBarangs:GetTipeBarangs,
			GetTipeBarang:GetTipeBarang,
			CreateTipeBarang:CreateTipeBarang,
			UpdateTipeBarang:UpdateTipeBarang,
			DeleteTipeBarang:DeleteTipeBarang
		}
});