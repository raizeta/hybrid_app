'use strict';
myAppModule.factory('singleapiService', ["$rootScope","$http","$q","$window","$filter",
function($rootScope,$http, $q, $window,$filter)
{
	$http.defaults.useXDomain = true;
    var geturl = function()
	{
		return "http://api.lukisongroup.com/master";
	}

	var gettoken = function()
	{
		return "?access-token=azLSTAYr7Y7TLsEAML-LsVq9cAXLyAWa";
	}

	var detailkunjungan = function(iduser,idcustomer,tanggal)
	{
		var globalurl = geturl();
		var deferred = $q.defer();
		var url = globalurl + "/detailkunjungans/search?USER_ID="+ iduser + "&CUST_ID=" + idcustomer +"&TGL=" + tanggal;
		
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

	var historikunjungan = function(iduser)
	{
		var url = geturl();
		var deferred = $q.defer();
		var url = url + "/detailkunjungans/search?USER_ID="+ iduser ;
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

	var gambarkujungan = function(iddetail)
	{
		var url = geturl();
		var deferred = $q.defer();
		var url = url + "/gambars/search?ID_DETAIL="+ iddetail ;
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

    var singledetailkunjungan = function(userInfo,groupcustomer,tanggalplan)
    {
        var globalurl = geturl();
        var deferred = $q.defer();
        var url = globalurl + "/detailkunjungans/search?USER_ID="+ userInfo + "&SCDL_GROUP=" + groupcustomer +"&TGL=" + tanggalplan;
        var method ="GET";
        $http({method:method, url:url,cache:false})
        .success(function(response) 
        {
            var customers = [];
            angular.forEach(response.DetailKunjungan, function(value, key) 
            {
                var ab={};
                ab.ID               = value.ID;
                ab.CUST_ID          = value.CUST_ID;
                ab.CUST_NM          = value.CUST_NM;
                ab.MAP_LAT          = value.MAP_LAT;
                ab.MAP_LNG          = value.MAP_LNG;
                ab.TANGGAL          = tanggalplan;
                var idcustomer      = value.CUST_ID;

                var geolocationstorage = JSON.parse($window.sessionStorage["geolocationstorage"]);
                var longitude1      = geolocationstorage.latitute;
                var latitude1       = geolocationstorage.longitude;

                var longitude2      = value.MAP_LAT;
                var latitude2       = value.MAP_LNG;
                var jarak           = $rootScope.jaraklokasi(longitude1,latitude1,longitude2,latitude2);
                var roundjarak      = $filter('setDecimal')(jarak,0);
                ab.JARAK            = roundjarak;

                var x = $.ajax
                ({
                    url: globalurl + "/statuskunjungans/search?ID_DETAIL="+ ab.ID,
                    type: "GET",
                    dataType:"json",
                    async: false
                }).responseJSON;

                if(x.code != 0)
                {
                    var x = x.StatusKunjungan[0];
                    var hasilstart           = parseInt(x.START_PIC);
                    var hasilend             = parseInt(x.END_PIC);
                    var hasilcheckin         = parseInt(x.CHECK_IN);
                    var hasilcheckout        = parseInt(x.CHECK_OUT);
                    var datainventorystock   = parseInt(x.INVENTORY_STOCK);
                    var datainventorysellin  = parseInt(x.INVENTORY_SELLIN);
                    var datainventorysellout = parseInt(x.INVENTORY_SELLOUT);
                    var datainventoryexpired = parseInt(x.INVENTORY_EXPIRED);
                }
                else
                {
                    var hasilstart           = 0;
                    var hasilend             = 0;
                    var hasilcheckin         = 0;
                    var hasilcheckout        = 0;
                    var datainventorystock   = 0;
                    var datainventorysellin  = 0;
                    var datainventorysellout = 0;
                    var datainventoryexpired = 0;
                }

                var jumlahstartdanend = hasilend + hasilstart + datainventorystock + datainventorysellin + datainventorysellout + datainventoryexpired + hasilcheckin + hasilcheckout;
                var persen = (jumlahstartdanend * 100)/8;
                console.log(persen);
                ab.persen = persen;
                if(persen == 100)
                {
                    ab.wanted = true;
                }
                customers.push(ab);
                deferred.resolve(customers);
            });   
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

    var singledetailkunjunganprosedur = function(userInfo,groupcustomer,tanggalplan,resolvegpslocation)
    {
        var globalurl = geturl();
        var deferred = $q.defer();
        var url = globalurl + "/statuskunjunganprosedurs/search?USER_ID="+ userInfo +"&TGL=" + tanggalplan + "&SCDL_GROUP=" + groupcustomer;
        var method ="GET";
        $http({method:method, url:url,cache:false})
        .success(function(response) 
        {
            var customers = [];
            angular.forEach(response.StatusKunjunganProsedur, function(value, key) 
            {
                var ab={};
                ab.ID               = value.ID;
                ab.CUST_ID          = value.CUST_ID;
                ab.CUST_NM          = value.CUST_NM;
                ab.MAP_LAT          = value.MAP_LAT;
                ab.MAP_LNG          = value.MAP_LNG;
                ab.TANGGAL          = tanggalplan;
                var idcustomer      = value.CUST_ID;
                
                var geolocationstorage = JSON.parse($window.sessionStorage["geolocationstorage"]);
                var longitude1      = geolocationstorage.latitute;
                var latitude1       = geolocationstorage.longitude;

                var longitude2      = value.MAP_LAT;
                var latitude2       = value.MAP_LNG;
                var jarak           = $rootScope.jaraklokasi(longitude1,latitude1,longitude2,latitude2);
                var roundjarak      = $filter('setDecimal')(jarak,0);
                ab.JARAK            = roundjarak;

                var statusstartpic              = ((value.START_PIC == null         || value.START_PIC == 0) ? 0 : 1);
                var statusendpic                = ((value.END_PIC == null           || value.END_PIC == 0) ? 0 : 1);
                var statuscheckin               = ((value.CHECK_IN == null          || value.CHECK_IN == 0) ? 0 : 1);
                var statuschekout               = ((value.CHECK_OUT == null         || value.CHECK_OUT == 0) ? 0 : 1);
                var statusinventorystock        = ((value.INVENTORY_STOCK == null   || value.INVENTORY_STOCK == 0) ? 0 : 1);
                var statusinventorysellin       = ((value.INVENTORY_SELLIN == null  || value.INVENTORY_SELLIN == 0) ? 0 : 1);
                var statusinventorysellout      = ((value.INVENTORY_SELLOUT == null || value.INVENTORY_SELLOUT == 0) ? 0 : 1);
                var statusinventoryexpired      = ((value.INVENTORY_EXPIRED == null || value.INVENTORY_EXPIRED == 0) ? 0 : 1);


                var totalstatus = statusstartpic + statusendpic + statusinventorystock + statusinventorysellin + statusinventorysellout + statusinventoryexpired + statuscheckin + statuscheckout;
                var persen = (totalstatus * 100)/8;
                ab.persen = persen;
                console.log(persen);
                if(persen == 100)
                {
                    ab.wanted = true;
                }
                customers.push(ab);
            });
            deferred.resolve(customers);   
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

	var singledetailkunjunganbyiddetail = function(iddetail)
	{
		var globalurl = geturl();
		var deferred = $q.defer();
		var url = globalurl + "/detailkunjunganbyiddetails/search?ID=" + iddetail;
		
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

	return{
			detailkunjungan:detailkunjungan,
			historikunjungan:historikunjungan,
			gambarkujungan:gambarkujungan,
			singledetailkunjungan:singledetailkunjungan,
			singledetailkunjunganbyiddetail:singledetailkunjunganbyiddetail,
            singledetailkunjunganprosedur:singledetailkunjunganprosedur
		}
}]);