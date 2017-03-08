angular.module('starter')
.factory('ChartsPurchasesFac',function($rootScope,$http,$q,$filter,$window,UtilService,ArrayObjectService)
{
	
	var GetPOPrice = function(statuscode)
    {
		var globalurl 		= UtilService.ApiUrl();
		var deferred 		= $q.defer();
		var month 			= $filter('date')(new Date(),'MM');
		var getUrl 			= UtilService.ApiUrl();
		var url 			= getUrl + "/chart/esmsuplierspos";
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

	return{
			GetPOPrice:GetPOPrice
		}
});