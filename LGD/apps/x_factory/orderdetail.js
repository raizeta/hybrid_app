angular.module('starter')
.factory('OrderDetailService', ["$rootScope","$http","$q","$window","UtilService",
function($rootScope,$http, $q, $window,UtilService)
{
	var globalurl 		= UtilService.apiurl();
	
	var GetOrderDetails = function()
    {
		var deferred 		= $q.defer();
		var url = globalurl + "/orderdetails/search?STATUS=1";
		var method ="GET";
		$http({method:method, url:url,cache:false})
        .success(function(response) 
        {
	        deferred.resolve(response.Orderdetail);
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
	var GetOrderDetailsByIdOrders = function(IDORDERS)
    {
		var deferred 		= $q.defer();
		var url = globalurl + "/orderdetails/search?STATUS=1&KD_ORDER=" + IDORDERS;
		var method ="GET";
		$http({method:method, url:url,cache:false})
        .success(function(response) 
        {
	        deferred.resolve(response.Orderdetail);
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
    var GetOrderDetail = function($id)
    {
		var deferred 		= $q.defer();
		var url = globalurl + "/orderdetails/" + $id;
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
    var CreateOrderDetail = function(detail)
    {
		var deferred 		= $q.defer();
		var result              = $rootScope.seriliazeobject(detail);
        var serialized          = result.serialized;
        var config              = result.config;

		var url = globalurl + "/orderdetails";
		var method ="POST";
		$http.post(url,serialized,config)
        .success(function(response,status,headers,config) 
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
    var UpdateOrderDetail = function($id)
    {
		var deferred 		= $q.defer();
		var url = globalurl + "/orderdetails/" + $id;
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
    var DeleteOrderDetail = function($id)
    {
		var deferred 		= $q.defer();
		var url = globalurl + "/orderdetails/" + $id;
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
			GetOrderDetails:GetOrderDetails,
			GetOrderDetail:GetOrderDetail,
			CreateOrderDetail:CreateOrderDetail,
			UpdateOrderDetail:UpdateOrderDetail,
			DeleteOrderDetail:DeleteOrderDetail,
			GetOrderDetailsByIdOrders:GetOrderDetailsByIdOrders
		}
}]);