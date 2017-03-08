'use strict';
myAppModule.factory('SalesTrackServices', ["$rootScope","$http","$q","$filter","$window","LocationService",
function($rootScope,$http, $q, $filter, $window,LocationService)
{
	var getUrl = function()
	{
		return "http://api.lukisongroup.com/master";
	}
	var gettoken = function()
	{
		return "?access-token=azLSTAYr7Y7TLsEAML-LsVq9cAXLyAWa";
	}

    var getSalesTracks= function(tanggalplan)
    {
        var url = getUrl();
        var deferred = $q.defer();

        $http.get(url + "/salestracks/search?TGL=" + tanggalplan)
        .success(function(data,status,headers,config) 
        {
            console.log(data);
            var salestracks   = [];
            _.each(data['Sales Track'], function(executes) 
            {
                var salestrack = {};
                salestrack.USER_ID = executes.USER_ID;
                salestrack.salesman = executes.NM_FIRST;
                if(executes.CHECKIN_TIME == null && executes.CHECKOUT_TIME == null)
                {
                    salestrack.CHECKIN_TIME     = "BLM KUNJUNGAN";
                    salestrack.CUST_KD          = "BLM KUNJUNGAN";
                    salestrack.CUST_NM          = "BLM KUNJUNGAN";
                    salestrack.CHECKOUT_TIME    = "BLM KUNJUNGAN";
                }
                else
                {
                    if(executes.CHECKOUT_TIME == null)
                    {
                        salestrack.CHECKOUT_TIME    = "BLM CHECK OUT";
                    }
                    else
                    {
                       salestrack.CHECKOUT_TIME     = executes.CHECKOUT_TIME; 
                    }
                    salestrack.CHECKIN_TIME     = executes.CHECKIN_TIME;
                    salestrack.CUST_KD          = executes.CUST_KD;
                    salestrack.CUST_NM          = executes.CUST_NM;
                    
                }
                salestracks.push(salestrack);

            });
            deferred.resolve(salestracks);
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
    
    var getSalesTrack= function(tanggalplan,salesmanid)
    {
        console.log(tanggalplan);
        var url = getUrl();
        var deferred = $q.defer();

        $http.get(url + "/salestrackperusers/search?TGL=" + tanggalplan + "&USER_ID=" + salesmanid)
        .success(function(data,status,headers,config) 
        {
            console.log(data);
            var salestracks   = [];
            _.each(data.SalesTrackPerUser, function(executes) 
            {
                var salestrack = {};
                salestrack.USER_ID = executes.USER_ID;
                salestrack.salesman = executes.NM_FIRST;
                salestrack.CUST_KD          = executes.CUST_KD;
                salestrack.CUST_NM          = executes.CUST_NM;
                if(executes.CHECKIN_TIME == null && executes.CHECKOUT_TIME == null)
                {
                    salestrack.CHECKIN_TIME     = "BLM KUNJUNGAN";
                    salestrack.CHECKOUT_TIME    = "BLM KUNJUNGAN";
                }
                else
                {
                    if(executes.CHECKOUT_TIME == null)
                    {
                        salestrack.CHECKOUT_TIME    = "BLM CHECK OUT";
                    }
                    else
                    {
                       salestrack.CHECKOUT_TIME     = executes.CHECKOUT_TIME; 
                    }
                    salestrack.CHECKIN_TIME     = executes.CHECKIN_TIME; 
                }
                salestracks.push(salestrack);
            });
            deferred.resolve(salestracks);
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
            getSalesTracks:getSalesTracks,
            getSalesTrack:getSalesTrack
		}
}]);