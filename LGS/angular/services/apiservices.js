'use strict';
myAppModule.factory('apiService', ["$http","$q","$window",function($http, $q, $window)
{
	var getUrl = function()
	{
		return "http://api.lukisongroup.com/master";
	}
	var gettoken = function()
	{
		return "?access-token=azLSTAYr7Y7TLsEAML-LsVq9cAXLyAWa";
	}
	
	var listagenda = function(userInfo,tanggalplan)
	{ 
		var idsalesman		= userInfo.id;
		var globalurl 		= getUrl();
		var deferred 		= $q.defer();
		var url = globalurl + "/jadwalkunjungans/search?USER_ID="+ idsalesman + "&TGL1=" + tanggalplan;
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

	var alllistagenda = function(idsalesman)
	{
		var globalurl = getUrl();
		var deferred = $q.defer();
		var url = globalurl + "/jadwalkunjungans/search?USER_ID="+ idsalesman;
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
	
	var listhistory = function(userinfo)
	{
		var iduser = userinfo.id;
		var globalurl = getUrl();
		var deferred = $q.defer();
		var url = globalurl + "/jadwalkunjungans/search?USER_ID=" + iduser;
		var method ="GET";
		$http({method:method, url:url,cache:false})
		.success(function(response,status,headers) 
		{
			//console.log(headers());
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
	var scdlgroupbyjadwalkunjungan = function(userInfo,tanggalplan)
	{
		var userid = userInfo.id;
		var globalurl = getUrl();
		var deferred = $q.defer();
		var url = globalurl + "/jadwalkunjungans/search?TGL1=" + tanggalplan + "&USER_ID=" + userid;
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

	var datasalesmanmemo = function()
	{
		var config = 
        {
            headers : 
            {
                // 'Accept': 'application/json',
                // 'Pragma': 'no-cache',
                // 'Content-Type': 'application/x-www-form-urlencoded;application/json;charset=utf-8;'
                
            }
        };
		var url = getUrl();
		var deferred = $q.defer();
		var url = url + "/salesmanmemos/search";
		var method ="GET";
		$http({method:method, url:url,config:config,cache:false})
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
			listagenda:listagenda,
			alllistagenda:alllistagenda,
			listhistory:listhistory,
			scdlgroupbyjadwalkunjungan:scdlgroupbyjadwalkunjungan,
			datasalesmanmemo:datasalesmanmemo
		}
}]);