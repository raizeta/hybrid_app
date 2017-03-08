angular.module('starter')
.factory('UnitBarangService',function($rootScope,$http, $q, $window,UtilService)
{
	var globalurl 		= UtilService.ApiUrl();
	var GetUnitBarangs = function()
    {
		var deferred 		= $q.defer();
		var url = globalurl + "/unitbarangs";
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
    var GetUnitBarang = function($id)
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
    var CreateUnitBarang = function()
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
    var UpdateUnitBarang = function($id)
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
    var DeleteUnitBarang = function($id)
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
			GetUnitBarangs:GetUnitBarangs,
			GetUnitBarang:GetUnitBarang,
			CreateUnitBarang:CreateUnitBarang,
			UpdateUnitBarang:UpdateUnitBarang,
			DeleteUnitBarang:DeleteUnitBarang
		}
});