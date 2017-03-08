'use strict';
myAppModule.factory('CustomerService', ["$http","$q","$window",function($http, $q, $window)
{
	var getUrl = function()
	{
		return "http://api.lukisongroup.com/master";
	}
	var gettoken = function()
	{
		return "?access-token=azLSTAYr7Y7TLsEAML-LsVq9cAXLyAWa";
	}
	var GetGroupCustomers = function()
	{
		var globalurl = getUrl();
		var deferred = $q.defer();
		var url = globalurl + "/customergroups";
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
	var GetSingleGroupCustomer = function(groupcustomer)
	{
		var globalurl = getUrl();
		var deferred = $q.defer();
		var url = globalurl + "/customers/search?SCDL_GROUP="+ groupcustomer;
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
	var GetCustomers = function(idcustomer)
	{
		var globalurl = getUrl();
		var deferred = $q.defer();
		var url = globalurl + "/customers/search?STATUS=1";
		var method ="GET";
		$http({method:method, url:url,cache:false})
        .success(function(response) 
        {
		  	deferred.resolve(response);
        })
        .error(function()
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

	var GetSingleCustomer = function(idcustomer)
	{
		var globalurl = getUrl();
		var deferred = $q.defer();
		var url = globalurl + "/customers/"+ idcustomer;
		var method ="GET";
		$http({method:method, url:url,cache:false})
        .success(function(response) 
        {
		  deferred.resolve(response);
        })
        .error(function()
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
			GetGroupCustomers:GetGroupCustomers,
			GetSingleCustomer:GetSingleCustomer,
			GetSingleGroupCustomer:GetSingleGroupCustomer,
			GetCustomers:GetCustomers
		}
}]);