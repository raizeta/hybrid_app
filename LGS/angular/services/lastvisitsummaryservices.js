'use strict';
myAppModule.factory('LastVisitService', ["$http","$q","$window",function($http, $q, $window)
{
	var getUrl = function()
	{
		return "http://api.lukisongroup.com/master";
	}
	var gettoken = function()
	{
		return "?access-token=azLSTAYr7Y7TLsEAML-LsVq9cAXLyAWa";
	}
	
	var LastVisitSummaryAll = function(tanggalplan,idgroupcustomer)
	{
		
		var config = 
        {
            headers : 
            {
                'Origin':'*',
                'Accept': 'application/json',
                'Cache-Control': 'no-cache;no-store',
                'Max-Age' : 0,
                'Pragma': 'no-cache',
                'X-Requested-With': 'XMLHttpRequest',
                'Content-Type': 'application/x-www-form-urlencoded;application/json;charset=utf-8;'     
            }
        };
		var globalurl = getUrl();
		var deferred = $q.defer();
		var url = globalurl + "/lastvisitallsummaries/search?TGL=" + tanggalplan + "&SCDL_GROUP=" + idgroupcustomer;
		var method ="GET";
        $http({method:method, url:url,config:config})
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
            	if(status === 200)
				{
					if(response.Jadwalkunjungan.length != 0)
					{
						var BarangSummaryAll = response.Jadwalkunjungan;
						var pengunjung = {};
						pengunjung.nama = response.Jadwalkunjungan[0].NM_FIRST;
						pengunjung.tanggal = response.Jadwalkunjungan[0].TGL;
						
				        var customers   = [];
				        _.each(BarangSummaryAll, function(executes) 
				        {
				            var existingCustomer = _.findWhere(customers, { CUST_KD: executes.CUST_KD });
				            if (existingCustomer) 
				            {
				            	var products = existingCustomer.products;

				            	var existproducts = _.findWhere(products, { KD_BARANG: executes.KD_BARANG });
				            	if(existproducts)
				            	{
				            		existproducts['TYPE' + executes.SO_TYPE]  = executes.SO_QTY;
				            	}
				            	else
				            	{
				            		var product = {};
				            		product.KD_BARANG = executes.KD_BARANG;
				            		product.NM_BARANG = executes.NM_BARANG;
				            		product['TYPE' + executes.SO_TYPE]  = executes.SO_QTY;
				            		products.push(product);
				            	}

				            }
				            else
				            {
				            	var customer = {};
				            	customer.CUST_KD = executes.CUST_KD;
				            	customer.CUST_NM = executes.CUST_NM;

				            	var products = [];
				            	var product = {};
				            	product.KD_BARANG = executes.KD_BARANG;
				            	product.NM_BARANG = executes.NM_BARANG;
				            	product['TYPE' + executes.SO_TYPE]  = executes.SO_QTY;

				            	products.push(product);
				            	customer.products = products;
				            	customers.push(customer);
				            }
				        });
						var filtersquantity= [];
				        angular.forEach(customers, function(value, key)
				        {
				            angular.forEach(value.products, function(value, key)
				            {
				                var existingFilter = _.findWhere(filtersquantity, { NM_BARANG: value.NM_BARANG });
				                if (existingFilter) 
				                {
				                    var index = filtersquantity.indexOf(existingFilter);

				                    var xstock = parseInt(filtersquantity[index].TOTSTOCK);
				                    var ystock = parseInt(value.TYPE5);
				                    var zstock = xstock + ystock;

				                    var xsellin = parseInt(filtersquantity[index].TOTSELL_IN);
				                    var ysellin = parseInt(value.TYPE6);
				                    var zsellin = xsellin + ysellin;

				                    var xsellout = parseInt(filtersquantity[index].TOTSELL_OUT);
				                    var ysellout = parseInt(value.TYPE7);
				                    var zsellout = xsellout + ysellout;

				                    var xreturn = parseInt(filtersquantity[index].TOTRETURN);
				                    var yreturn = parseInt(value.TYPE8);
				                    var zreturn = xreturn + yreturn;

				                    var xrequest = parseInt(filtersquantity[index].TOTREQUEST);
				                    var yrequest = parseInt(value.TYPE9);
				                    var zrequest = xrequest + yrequest;

				                    filtersquantity[index].TOTSELL_IN  = zsellin;
				                    filtersquantity[index].TOTSELL_OUT = zsellout;
				                    filtersquantity[index].TOTSTOCK    = zstock;
				                    filtersquantity[index].TOTRETURN   = zreturn;
				                    filtersquantity[index].TOTREQUEST  = zrequest;
				                }
				                else
				                {
				                    var filter      = {};
				                    filter.KD_BARANG            = value.KD_BARANG;
				                    filter.NM_BARANG            = value.NM_BARANG;
				                    filter.TOTSTOCK             = value.TYPE5;
				                    filter.TOTSELL_IN           = value.TYPE6;
				                    filter.TOTSELL_OUT          = value.TYPE7;
				                    filter.TOTRETURN            = value.TYPE8;
				                    filter.TOTREQUEST           = value.TYPE9;
				                    filtersquantity.push(filter);
				                    console.log(filter);
				                }
				            });
				        });
						var result = {};
						result.siteres = customers;
						result.totalalls = filtersquantity;
						console.log(filtersquantity);
						result.pengunjung = pengunjung;

				        deferred.resolve(result);
					}
					else
					{
						deferred.resolve([]);
					} 
		        }
		        else if(status === 304)
		        {
		        	alert("Status Sukses Dengan Kode 304");
		        }
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
			LastVisitSummaryAll:LastVisitSummaryAll,
		}
}]);