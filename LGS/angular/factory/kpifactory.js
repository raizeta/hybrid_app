'use strict';
myAppModule.factory('KPIFac',function($http,$q,$window,UtilService,StorageService)
{
	var GetKPI = function(tanggalplan,userid)
	{
		var globalurl 	= UtilService.ApiUrl();
		var deferred 	= $q.defer();
		var url 		= globalurl + "chart/esmsaleskpis?MONTH="+ tanggalplan +"&USER_ID="+ userid;
		var method 		= "GET";
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
			GetKPI:GetKPI
		}
});