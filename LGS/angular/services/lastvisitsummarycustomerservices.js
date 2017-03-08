'use strict';
myAppModule.factory('LastVisitCustomerService', ["$http","$q","$window",function($http, $q, $window)
{
	var getUrl = function()
	{
		return "http://api.lukisongroup.com/master";
	}
	var gettoken = function()
	{
		return "?access-token=azLSTAYr7Y7TLsEAML-LsVq9cAXLyAWa";
	}
	
	var LastVisitSummaryCustomer = function(idcustomer,tanggalplan)
	{
		
		var globalurl = getUrl();
		var deferred = $q.defer();

		var url = globalurl + "/lastvisitsinglesummaries/search?CUST_KD=" + idcustomer + "&TGL=" + tanggalplan;
		var method ="GET";
        $http({method:method, url:url})
		.success(function(response,status,headers) 
		{
			if(angular.isDefined(response.statusCode))
            {
               if(response.statusCode == 404)
                {
                    deferred.resolve([]);
                } 
            }
            else
            {
            	var customers = response.LVSummaryCustomer;
				var filterproduct = [];
		        angular.forEach(customers, function(value, key)
		        {
		        	var existingFilter = _.findWhere(filterproduct, { NM_BARANG: value.NM_BARANG });
		        	if(existingFilter)
		        	{
		        		existingFilter['TYPE' + value.SO_TYPE]  = value.SO_QTY;
		        	}
		        	else
		        	{
		        		var filter      = {};
		        		filter.NM_FIRST 				= value.NM_FIRST;
		        		filter.TGL 						= value.TGL;
	                    filter.KD_BARANG            	= value.KD_BARANG;
	                    filter.NM_BARANG            	= value.NM_BARANG;
	                    filter['TYPE' + value.SO_TYPE]  = value.SO_QTY;
	                    filterproduct.push(filter);
		        	}
		        });
				deferred.resolve(filterproduct);
            }
			
		})
		.error(function(err,status)
        {
			if (status === 404)
			{
	        	alert("error" + 404);
	        	deferred.resolve([]);
	      	}
	      	if (status === 304)
			{
	        	alert("Status Error Dengan Status Kode 304");
	      	}
	      	else	
      		{
	        	deferred.reject(err);
	      	}
        });

        return deferred.promise;		  
	}

	return{
			LastVisitSummaryCustomer:LastVisitSummaryCustomer,
		}
}]);