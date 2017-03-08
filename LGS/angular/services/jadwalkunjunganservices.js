'use strict';
myAppModule.factory('JadwalKunjunganService', ["$rootScope","$http","$q","$filter","$window","LocationService",
function($rootScope,$http, $q, $filter, $window,LocationService)
{
	var LSListHistory,LSListAgenda;
    var tanggalsekarang = $filter('date')(new Date(),'yyyy-MM-dd');
    var getUrl = function()
	{
		return "http://api.lukisongroup.com/master";
	}
	var gettoken = function()
	{
		return "?access-token=azLSTAYr7Y7TLsEAML-LsVq9cAXLyAWa";
	}
    	
	var GetListHistory = function(userinfo)
	{
		var iduser = userinfo.id;
		var globalurl = getUrl();
		var deferred = $q.defer();
		var url = globalurl + "/jadwalkunjungans/search?USER_ID=" + iduser;
		var method ="GET";
		$http({method:method, url:url,cache:false})
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
                deferred.resolve(response.JadwalKunjungan); 
            }
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

	var GetGroupCustomerByTanggalPlan = function(userInfo,tanggalplan)
    { 
        var idsalesman      = userInfo.id;
        var globalurl       = getUrl();
        var deferred        = $q.defer();
        var url = globalurl + "/jadwalkunjungans/search?USER_ID="+ idsalesman + "&TGL1=" + tanggalplan;
        var method ="GET";
        $http({method:method, url:url,cache:false})
        .success(function(response) 
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
               deferred.resolve(response.JadwalKunjungan[0]); 
            }
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

	var GetSingleDetailKunjunganProsedur = function(userInfo,groupcustomer,tanggalplan,gpslongitude,gpslatitude)
    {
        var globalurl = getUrl();
        var deferred = $q.defer();
        var url = globalurl + "/statuskunjunganprosedurs/search?USER_ID="+ userInfo +"&TGL=" + tanggalplan + "&SCDL_GROUP=" + groupcustomer + "&access-token=azLSTAYr7Y7TLsEAML-LsVq9cAXLyAWa";
        var method ="GET";
        $http({method:method, url:url,cache:false})
        .success(function(response,status,headers,config) 
        {
            // console.log(headers());
            if(angular.isDefined(headers()['last-modified']))
            {
                console.log("Dari Cache");
            }

            if(angular.isDefined(response.statusCode))
            {
                deferred.resolve([]);
            }

            else
            {
                var customers = [];
                angular.forEach(response.StatusKunjunganProsedur, function(value, key) 
                {
                    var customer={};
                    customer.ID               = value.ID;
                    customer.CUST_ID          = value.CUST_ID;
                    customer.CUST_NM          = value.CUST_NM;
                    customer.MAP_LAT          = value.MAP_LAT;
                    customer.MAP_LNG          = value.MAP_LNG;
                    customer.TANGGAL          = tanggalplan;
                    customer.CHECKIN_TIME     = $filter('date')(value.CHECKIN_TIME,'dd-MM-yyyy HH:mm:ss');
                    customer.CHECKOUT_TIME    = $filter('date')(value.CHECKOUT_TIME,'dd-MM-yyyy HH:mm:ss');

                    customer.STSSTART_PIC              = ((value.START_PIC == null         || value.START_PIC == 0) ? 0 : 1);
                    customer.STSEND_PIC                = ((value.END_PIC == null           || value.END_PIC == 0) ? 0 : 1);
                    customer.STSCHECK_IN               = ((value.CHECK_IN == null          || value.CHECK_IN == 0) ? 0 : 1);
                    customer.STSCHECK_OUT              = ((value.CHECK_OUT == null         || value.CHECK_OUT == 0) ? 0 : 1);
                    customer.STSINVENTORY_STOCK        = ((value.INVENTORY_STOCK == null   || value.INVENTORY_STOCK == 0) ? 0 : 1);
                    customer.STSINVENTORY_SELLIN       = ((value.INVENTORY_SELLIN == null  || value.INVENTORY_SELLIN == 0) ? 0 : 1);
                    customer.STSINVENTORY_SELLOUT      = ((value.INVENTORY_SELLOUT == null || value.INVENTORY_SELLOUT == 0) ? 0 : 1);
                    customer.STSINVENTORY_EXPIRED      = ((value.INVENTORY_EXPIRED == null || value.INVENTORY_EXPIRED == 0) ? 0 : 1);
                    customer.STSINVENTORY_REQUEST      = ((value.REQUEST == null           || value.REQUEST == 0) ? 0 : 1);
                    customer.STSINVENTORY_RETURN       = 0;
                    
                    if(customer.STSCHECK_IN  == 0 || customer.STSCHECK_IN  == null)
                    {
                        customer.imagecheckout = "asset/admin/dist/img/normal.jpg";
                    }
                    else
                    {
                        if((customer.STSCHECK_OUT  == 1))
                        {
                            customer.imagecheckout = "asset/admin/dist/img/customer.jpg";
                        }
                        else
                        {
                            customer.imagecheckout = "asset/admin/dist/img/customerlogo.jpg";
                        } 
                    }

                    var longitude1      = gpslongitude;
                    var latitude1       = gpslatitude;
                    
                    var longitude2      = customer.MAP_LNG;
                    var latitude2       = customer.MAP_LAT;
                    
                    
                    var jarak           = $rootScope.jaraklokasi(longitude1,latitude1,longitude2,latitude2);
                    //var roundjarak      = $filter('setDecimal')(jarak,0);
                    if(jarak < 1000)
                    {
                        customer.JARAKMETER = $filter('setDecimal')(jarak,0) + " meter";
                    }
                    else
                    {
                        customer.JARAKMETER = $filter('setDecimal')(jarak/1000,1) + " km";
                    }
                    customer.JARAK            = $filter('setDecimal')(jarak/1000,0);


                    var totalstatus = customer.STSSTART_PIC + customer.STSEND_PIC + customer.STSINVENTORY_STOCK + customer.STSINVENTORY_SELLIN + customer.STSINVENTORY_SELLOUT + customer.STSINVENTORY_EXPIRED + customer.STSINVENTORY_REQUEST + customer.STSINVENTORY_RETURN + customer.STSCHECK_IN + customer.STSCHECK_OUT;
                    var persen = (totalstatus * 100)/10;
                    customer.persen = persen;
                    if(persen == 100)
                    {
                        customer.wanted = true;
                    }
                    customers.push(customer);
                });
                deferred.resolve(customers);  
            }  
        })
        .error(function(err,status)
        {
            deferred.reject(err);
        });
        return deferred.promise; 
    }

    var GetJustStatusKunjungan = function(ID_DETAIL)
    {
        var globalurl = getUrl();
        var deferred = $q.defer();
        var url = globalurl + "/statuskunjungans/search?ID_DETAIL="+ ID_DETAIL;
        var method ="GET";
        $http({method:method, url:url,cache:false})
        .success(function(response,status,headers,config) 
        {
            console.log(headers());
            if(angular.isDefined(headers()['last-modified']))
            {
                console.log("Dari Cache");
            }

            if(angular.isDefined(response.statusCode))
            {
               if(response.statusCode == 404)
                {
                    deferred.resolve([]);
                } 
            }
            else
            {
                var result = response.StatusKunjungan[0];
                var resultstatus = {};
                resultstatus.statusstartpic              = ((result.START_PIC == null         || result.START_PIC == 0) ? 0 : 1);
                resultstatus.statusendpic                = ((result.END_PIC == null           || result.END_PIC == 0) ? 0 : 1);
                resultstatus.statusinventorystock        = ((result.INVENTORY_STOCK == null   || result.INVENTORY_STOCK == 0) ? 0 : 1);
                resultstatus.statusinventorysellin       = ((result.INVENTORY_SELLIN == null  || result.INVENTORY_SELLIN == 0) ? 0 : 1);
                resultstatus.statusinventorysellout      = ((result.INVENTORY_SELLOUT == null || result.INVENTORY_SELLOUT == 0) ? 0 : 1);
                resultstatus.statusinventoryexpired      = ((result.INVENTORY_EXPIRED == null || result.INVENTORY_EXPIRED == 0) ? 0 : 1);
                resultstatus.statusinventoryreturn       = ((result.INVENTORY_RETURN == null  || result.INVENTORY_RETURN == 0) ? 0 : 1);
                resultstatus.statusinventoryrequest      = ((result.REQUEST == null  || result.REQUEST == 0) ? 0 : 1);
                
                deferred.resolve(resultstatus); 
            }
              
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
			GetListHistory:GetListHistory,
            GetGroupCustomerByTanggalPlan:GetGroupCustomerByTanggalPlan,
			GetSingleDetailKunjunganProsedur:GetSingleDetailKunjunganProsedur,
            GetJustStatusKunjungan:GetJustStatusKunjungan
		}
}]);