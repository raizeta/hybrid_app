angular.module('starter')
.factory('ChartsSalesFac',function($rootScope,$http,$q,$filter,$window,UtilService,ArrayObjectService)
{
	var globalurl 		= UtilService.ApiUrl();
	var GetVisitStock = function(bulan)
    {
		var deferred 		= $q.defer();
		var month;
		if(bulan)
		{
			month 			= bulan;
		}
		else
		{
			month 			= $filter('date')(new Date(),'MM');	
		}
		
		var getUrl 			= UtilService.ApiUrl();
		var url 			= getUrl + "/chart/esmsalesmds?MONTH=" + month;
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
    var GetSalesmans = function()
    {
        var getUrl          = UtilService.ApiUrl();
        var deferred        = $q.defer();

        var autouuid        = autouuid;
        var urluuid         = getUrl + "/chart/esmsalesmdusers";
        $http.get(urluuid)
        .success(function(response,status, headers, config) 
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
                deferred.resolve(response.SalesUser); 
            }
        })
        .error(function(err)
        {
            deferred.reject("username_salah");
        });

        return deferred.promise;
    }
    var GetSalesmansPerUser = function(tglstart,tglend,userid)
    {
        var getUrl          = UtilService.ApiUrl();
        var deferred        = $q.defer();

        var autouuid        = autouuid;
        var urluuid         = getUrl + "/chart/esmsalesmdusers/search?TGLSTART="+ tglstart +"&TGLEND=" + tglend + "&USER_ID=" + userid;
        $http.get(urluuid)
        .success(function(response,status, headers, config) 
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
                deferred.resolve(response); 
            }
        })
        .error(function(err)
        {
            deferred.reject(err);
        });

        return deferred.promise;
    }

	return{
			GetVisitStock:GetVisitStock,
			GetSalesmans:GetSalesmans,
            GetSalesmansPerUser:GetSalesmansPerUser
		}
});