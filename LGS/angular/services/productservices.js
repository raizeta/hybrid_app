'use strict';
myAppModule.factory('ProductService', ["$rootScope","$http","$q","$window","$cordovaSQLite", 
function($rootScope,$http, $q, $window, $cordovaSQLite)
{
	var getUrl = function()
	{
		return "http://api.lukisongroup.com/master";
	}
	var gettoken = function()
	{
		return "?access-token=azLSTAYr7Y7TLsEAML-LsVq9cAXLyAWa";
	}

	var GetDataBarangsSqlite = function()
    {
		var globalurl 		= getUrl();
		var deferred 		= $q.defer();
		var url = globalurl + "/barangpenjualans/search?KD_CORP=ESM&KD_KATEGORI=01&STATUS=1";
		var method ="GET";

        var querybarang = "SELECT * FROM Brgpenjualan";
        $cordovaSQLite.execute($rootScope.db, querybarang, [])
        .then(function(result) 
        {
            if (result.rows.length > 0) 
            {
            	var resultbarang = [];
            	var l = result.rows.length;
                for (var i=0; i < l; i++) 
                {
		            var product = {};
		            product.ID_SERVER 		= result.rows.item(i).ID_SERVER
		            product.KD_BARANG 		= result.rows.item(i).KD_BARANG;
		            product.NM_BARANG 		= result.rows.item(i).NM_BARANG;
		            product.IMAGE_LOCAL 	= result.rows.item(i).IMAGE_LOCAL;
		            product.IMAGE_BASE64 	= result.rows.item(i).IMAGE_BASE64;
		            resultbarang.push(product);
                }
                deferred.resolve(resultbarang);
            }
            else
            {
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
				        var resultbarang = [];
				        angular.forEach(response.BarangPenjualan, function(value, key)
				        {
				            var newID_SERVER 	= value.ID;
				            var newKD_BARANG 	= value.KD_BARANG;
				            var newNM_BARANG 	= value.NM_BARANG;
				            var newIMAGE_LOCAL 	= value.KD_BARANG;
				            var newIMAGE_BASE64 = value.IMAGE;

				            var queryinsertbarang = 'INSERT INTO Brgpenjualan (ID_SERVER,KD_BARANG,NM_BARANG,IMAGE_LOCAL,IMAGE_BASE64) VALUES (?,?,?,?,?)';
	                        $cordovaSQLite.execute($rootScope.db,queryinsertbarang,[newID_SERVER,newKD_BARANG,newNM_BARANG,newIMAGE_LOCAL,newIMAGE_BASE64])
	                        .then(function(result) 
	                        {
	                            console.log("Barang Berhasil Disimpan Di Local!");
	                        }, 
	                        function(error) 
	                        {
	                            alert("Barang Gagal Disimpan Di Local: " + error.message);
	                        });

	                        var product = {};
				            product.ID_SERVER 		= value.ID;
				            product.KD_BARANG 		= value.KD_BARANG;
				            product.NM_BARANG 		= value.NM_BARANG;
				            product.IMAGE_LOCAL 	= value.IMAGE_LOCAL;
				            product.IMAGE_BASE64 	= value.IMAGE;
				            
				            resultbarang.push(product);
				        });
				        deferred.resolve(resultbarang);
			    	}
		        })
		        .error(function(err,status)
		        {
		        	deferred.reject(err);
		        });
            }
        },
        function(error) 
        {
            deferred.reject(error.message);
        });

        return deferred.promise;  
    }

	var GetDataBarangs = function()
    {
		var globalurl 		= getUrl();
		var deferred 		= $q.defer();
		var url = globalurl + "/barangpenjualans/search?KD_CORP=ESM&KD_KATEGORI=01&STATUS=1";
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
		        var result = [];
		        angular.forEach(response.BarangPenjualan, function(value, key)
		        {
		            var KD_BARANG = value.KD_BARANG;
		            result.push(KD_BARANG);
		        });
		        deferred.resolve(result);
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
    
    var GetObjectDataBarangs = function()
    {
		var globalurl 		= getUrl();
		var deferred 		= $q.defer();
		var url = globalurl + "/barangpenjualans/search?KD_CORP=ESM&KD_KATEGORI=01&STATUS=1";
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
		        var result = [];
		        angular.forEach(response.BarangPenjualan, function(value, key)
		        {
		            var product = {};
		            product.KD_BARANG 		= value.KD_BARANG;
		            product.NM_BARANG 		= value.NM_BARANG;
		            product.IMAGE_LOCAL 	= value.KD_BARANG;
		            product.IMAGE_BASE64 	= value.IMAGE;
		            result.push(product);
		        });
		        deferred.resolve(result);
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
    
    var GetDataBarangsInventory = function(idcustomer,tanggalplan,sotype)
    {
		
		var globalurl 		= getUrl();
		var deferred 		= $q.defer();
		var url = globalurl + "/productinventories/search?CUST_KD=" + idcustomer + "&TGL=" + tanggalplan + "&SO_TYPE=" + sotype;
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
		        var baranginventory = [];
		        angular.forEach(response.ProductInventory, function(value, key)
		        {
		            var KD_BARANG = value.KD_BARANG;
		            baranginventory.push(KD_BARANG);
		        });
		        deferred.resolve(baranginventory);
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
			GetDataBarangsSqlite:GetDataBarangsSqlite,
			GetDataBarangs:GetDataBarangs,
			GetObjectDataBarangs:GetObjectDataBarangs,
			GetDataBarangsInventory:GetDataBarangsInventory
		}
}]);