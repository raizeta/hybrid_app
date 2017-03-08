angular.module('starter')
.factory('OrderService', ["$rootScope","$http","$q","$window","OrderDetailService",
function($rootScope,$http, $q, $window,OrderDetailService)
{
	var globalurl 		= $rootScope.linkurl.linkurl;
	var GetOrders = function()
    {
		var deferred 		= $q.defer();
		var url = globalurl + "/orders/search?STATUS=1";
		var method ="GET";
		$http({method:method, url:url,cache:false})
        .success(function(response) 
        {
	        deferred.resolve(response.Orders);
          	
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
    var GetOrder = function($id)
    {
		var deferred 		= $q.defer();
		var url = globalurl + "/orders/" + $id;
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
    var CreateOrder = function(detail,orderdetail)
    {
		var deferred 		    = $q.defer();
		var result              = $rootScope.seriliazeobject(detail);
        var serialized          = result.serialized;
        var config              = result.config;

		var url = globalurl + "/orders";
		$http.post(url,serialized,config)
        .success(function(data,status,headers,config) 
        {
	        angular.forEach(orderdetail,function(value,key)
          	{
	            if(angular.isDefined(value.quantity))
	            {
	                var detailproduct = {};
	                detailproduct.KD_PRODUCT  = value.KD_PRODUCT;
	                detailproduct.JLH_ITEM    = value.quantity;
	                detailproduct.HARGA_ITEM  = 1000;
	                detailproduct.KD_ORDER    = data.ID;
	                detailproduct.CREATE_AT   = $rootScope.tanggalwaktuharini;
	                detailproduct.CREATE_BY   = 1;
	                detailproduct.UPDATE_AT   = $rootScope.tanggalwaktuharini;
	                detailproduct.UPDATE_BY   = 1;

	                OrderDetailService.CreateOrderDetail(detailproduct)
	                .then (function(response)
	                {
	                },
	                function (error)
	                {
	                  console.log(error);
	                });
	            }
          	});

          	deferred.resolve(data);
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
    var UpdateOrder = function($id)
    {
		var deferred 		= $q.defer();
		var url = globalurl + "/orders/" + $id;
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
    var DeleteOrder = function($id)
    {
		var deferred 		= $q.defer();
		var url = globalurl + "/orders/" + $id;
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
			GetOrders:GetOrders,
			GetOrder:GetOrder,
			CreateOrder:CreateOrder,
			UpdateOrder:UpdateOrder,
			DeleteOrder:DeleteOrder
		}
}]);