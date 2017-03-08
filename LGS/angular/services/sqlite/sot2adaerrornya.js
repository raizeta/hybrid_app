'use strict';
myAppModule.factory('SOT2Services', ["$rootScope","$http","$q","$filter","$window","$cordovaSQLite",
function($rootScope,$http, $q, $filter, $window,$cordovaSQLite)
{
    var getUrl = function()
    {
        return "http://api.lukisongroup.com/master";
    }
    var gettoken = function()
    {
        return "?access-token=azLSTAYr7Y7TLsEAML-LsVq9cAXLyAWa";
    }
    
    var getSOT2Quantity = function (CUST_KD,tanggalplan,sotype)
    {
        var deferred = $q.defer();
        var queryabsensi = 'SELECT * FROM Sot2 WHERE CUST_KD = ? AND TGL = ? AND SO_TYPE = ?';
        $cordovaSQLite.execute($rootScope.db, queryabsensi, [CUST_KD,tanggalplan,sotype])
        .then(function(result) 
        {
            if (result.rows.length > 0) 
            {
                var datasot2 = [];
                var l = result.rows.length;
                for (var i=0; i < l; i++) 
                {
                    var KD_BARANG = result.rows.item(i).KD_BARANG;
                    datasot2.push(KD_BARANG);
                }
                var resultdatasot2 = $rootScope.unique(datasot2);
                deferred.resolve(resultdatasot2);
            }
            else
            {
                deferred.resolve([]);
            }
        },

        function(error) 
        {
            deferred.resolve(error.message);
        });
        return deferred.promise;  
    }

    var getSOT2Type = function (SO_ID)
    {
        var url = getUrl();
        var deferred = $q.defer();
        
        var querysot2type = 'SELECT * FROM Sot2Type WHERE UNTUK_DEVICE = ? AND STATUS = ?';
        $cordovaSQLite.execute($rootScope.db, querysot2type, ['ANDROID',1])
        .then(function(result) 
        {
            if (result.rows.length > 0) 
            {
                var resulttypeaktifitas = [];
                var l = result.rows.length;
                for (var i=0; i < l; i++) 
                {
                    var detailresult = {};
                    detailresult.ID_SERVER          = result.rows.item(i).ID_SERVER;
                    detailresult.SO_TYPE            = result.rows.item(i).SO_TYPE;
                    detailresult.UNTUK_DEVICE       = result.rows.item(i).UNTUK_DEVICE;
                    detailresult.STATUS             = result.rows.item(i).STATUS;
                    detailresult.SO_ID              = result.rows.item(i).SO_ID;
                    detailresult.DIALOG_TITLE       = result.rows.item(i).DIALOG_TITLE;
                    detailresult.QTY                = 0;

                    resulttypeaktifitas.push(detailresult);
                }

                deferred.resolve(resulttypeaktifitas);
            }
            else
            {
                $http.get(url + "/tipesalesaktivitas/search?UNTUK_DEVICE=ANDROID&STATUS=1")
                .success(function(response,status, headers, config) 
                {
                    if(angular.isDefined(response.statusCode))
                    {
                        deferred.resolve([]);
                    }
                    else
                    {
                        angular.forEach(response.Tipesalesaktivitas, function(value, key)
                        {
                            var newID_SERVER          = value.ID;
                            var newSO_TYPE            = value.SO_TYPE;
                            var newUNTUK_DEVICE       = value.UNTUK_DEVICE;
                            var newSTATUS             = value.STATUS;
                            var newSO_ID              = value.SO_ID;
                            var newDIALOG_TITLE       = value.DIALOG_TITLE;

                            var queryinsertagendatoday = 'INSERT INTO Sot2Type (ID_SERVER,SO_TYPE,UNTUK_DEVICE,STATUS,SO_ID,DIALOG_TITLE) VALUES (?,?,?,?,?,?)';
                            $cordovaSQLite.execute($rootScope.db,queryinsertagendatoday,[newID_SERVER,newSO_TYPE,newUNTUK_DEVICE,newSTATUS,newSO_ID,newDIALOG_TITLE])
                            .then(function(result) 
                            {
                                console.log("Sot2Type Berhasil Disimpan Di Local!");
                            }, 
                            function(error) 
                            {
                                console.log("Sot2Type Gagal Disimpan Ke Local: " + error.message);
                            });
                        });

                        deferred.resolve(response.Tipesalesaktivitas);   
                    }  
                },
                function (error)
                {
                    deferred.rejected(error);
                });
            }
        },
        function(error) 
        {
            deferred.resolve(error.message);
        });

        return deferred.promise;  
    }

    var getSOT2SummaryPerCustomer = function (tanggalplan,userid,resolveobjectbarangsqlite,resolvesot2type,CUST_ID)
    {
        var deferred = $q.defer();
        var querysummary = 'SELECT * FROM Sot2 WHERE TGL = ? AND USER_ID = ? AND CUST_KD = ?';
        $cordovaSQLite.execute($rootScope.db, querysummary, [tanggalplan,userid,CUST_ID])
        .then(function(result) 
        {
            if (result.rows.length > 0) 
            {
                var summarypercustomer = [];
                var l = result.rows.length;
                for (var i=0; i < l; i++) 
                {
                    var summary = {};
                    summary.KD_BARANG           = result.rows.item(i).KD_BARANG;
                    summary.NM_BARANG           = result.rows.item(i).NM_BARANG;
                    summary.CUST_KD             = result.rows.item(i).CUST_KD;
                    summary.CUST_NM             = result.rows.item(i).CUST_NM;
                    summary.SO_TYPE             = result.rows.item(i).SO_TYPE;
                    summary.SO_QTY              = result.rows.item(i).SO_QTY;
                    summary.DIALOG_TITLE        = result.rows.item(i).DIALOG_TITLE;
                    summarypercustomer.push(summary);
                }
                
                var productdas      = resolveobjectbarangsqlite;
                var typepenjualan   = resolvesot2type;

                var combination = [];
                for(var i=0;i < productdas.length ; i ++)
                {
                    var product = {};
                    product.KD_BARANG            = productdas[i].KD_BARANG;
                    product.NM_BARANG            = productdas[i].NM_BARANG;
                    
                    product.penjualan = [];
                	for(var j=0;j < typepenjualan.length ; j ++)
                    {
                        var detail = {};
                        detail.SO_TYPE              = typepenjualan[j].SO_TYPE;
                        detail.SO_ID                = typepenjualan[j].SO_ID;
                        detail.DIALOG_TITLE         = typepenjualan[j].DIALOG_TITLE;
                        detail.QTY                  = 0;
                        product.penjualan.push(detail);
                    }
                	combination.push(product);

                }
                
                angular.forEach(summarypercustomer, function (value,key)
        	    {
        	        var existproduct = _.findWhere(combination, { KD_BARANG: value.KD_BARANG });
        	        var existtypepenjualan = _.findWhere(existproduct.penjualan, { SO_ID: value.SO_TYPE });
        	        existtypepenjualan.QTY = value.SO_QTY;
        	    });
                
                deferred.resolve(combination);
            }
            else
            {
            	var productdas      = resolveobjectbarangsqlite;
                var typepenjualan   = resolvesot2type;

                var combination = [];
                for(var i=0;i < productdas.length ; i ++)
                {
                    var product = {};
                    product.KD_BARANG            = productdas[i].KD_BARANG;
                    product.NM_BARANG            = productdas[i].NM_BARANG;
                    
                    product.penjualan = [];
                	for(var j=0;j < typepenjualan.length ; j ++)
                    {
                        var detail = {};
                        detail.KD_TYPE              = typepenjualan[j].SO_TYPE;
                        detail.SO_ID                = typepenjualan[j].SO_ID;
                        detail.DIALOG_TITLE         = typepenjualan[j].DIALOG_TITLE;
                        detail.QTY                  = 0;
                        product.penjualan.push(detail);
                    }
                	combination.push(product);
                }
                deferred.resolve(combination);
            }
        },

        function(error) 
        {
            deferred.resolve(error.message);
        });
        return deferred.promise;  
    }

    var getSOT2SummaryAllCustomer = function (tanggalplan,userid,resolveobjectbarangsqlite,resolvesot2type)
    {
        var deferred = $q.defer();

        var productdas      = resolveobjectbarangsqlite;
        var typepenjualan   = resolvesot2type;

        var querysummary = 'SELECT * FROM Sot2 WHERE TGL = ? AND USER_ID = ?';
        $cordovaSQLite.execute($rootScope.db, querysummary, [tanggalplan,userid])
        .then(function(result) 
        {
            if (result.rows.length > 0) 
            {
                var summaryallcustomer = [];
                var l = result.rows.length;
                for (var i=0; i < l; i++) 
                {
                    var summary = {};
                    summary.KD_BARANG           = result.rows.item(i).KD_BARANG;
                    summary.NM_BARANG           = result.rows.item(i).NM_BARANG;
                    summary.CUST_KD             = result.rows.item(i).CUST_KD;
                    summary.CUST_NM             = result.rows.item(i).CUST_NM;
                    summary.SO_TYPE             = result.rows.item(i).SO_TYPE;
                    summary.SO_QTY              = result.rows.item(i).SO_QTY;
                    summary.DIALOG_TITLE        = result.rows.item(i).DIALOG_TITLE;

                    summaryallcustomer.push(summary);
                }

                var customers = [];
                var queryagendatoday = "SELECT * FROM Agenda WHERE TGL = ? AND USER_ID = ?";
                $cordovaSQLite.execute($rootScope.db, queryagendatoday, [tanggalplan, userid])
                .then(function(result) 
                {
                    var l = result.rows.length;
                    
                    for (var i=0; i < l; i++) 
                    {
                        var customer = {};
                        customer.ID                         = result.rows.item(i).ID_SERVER;
                        customer.CUST_ID                    = result.rows.item(i).CUST_ID;
                        customer.CUST_NM                    = result.rows.item(i).CUST_NM;
                        customers.push(customer);
                    }
                    
                    angular.forEach(customers, function(value,key)
                    {
                        angular.forEach(productdas, function(value,key)
                        {
                            value.penjualan = typepenjualan;
                        });
                        value.products = productdas;
                    });
                    var combination = customers; 
                    angular.forEach(summaryallcustomer, function (value,key)
                    {
                        var existcustomer           = _.findWhere(combination, { CUST_ID: value.CUST_KD });
                        var existproduct            = _.findWhere(existcustomer.products, { KD_BARANG: value.KD_BARANG });
                        var existtypepenjualan      = _.findWhere(existproduct.penjualan, { SO_ID: value.SO_TYPE });
                        existtypepenjualan.QTY      = value.SO_QTY;
                    });
                    var resultcombinations = combination;
                    deferred.resolve(resultcombinations);
                });
            }
            else
            {
                var customers = [];
                var queryagendatoday = "SELECT * FROM Agenda WHERE TGL = ? AND USER_ID = ?";
                $cordovaSQLite.execute($rootScope.db, queryagendatoday, [tanggalplan, userid])
                .then(function(result) 
                {
                    if (result.rows.length > 0) 
                    {
                        var l = result.rows.length;
                        
                        for (var i=0; i < l; i++) 
                        {
                            var customer = {};
                            customer.ID                         = result.rows.item(i).ID_SERVER;
                            customer.CUST_ID                    = result.rows.item(i).CUST_ID;
                            customer.CUST_NM                    = result.rows.item(i).CUST_NM;
                            customers.push(customer);
                        }
                        
                        angular.forEach(customers, function(value,key)
                        {
                            angular.forEach(productdas, function(value,key)
                            {
                                value.penjualan = typepenjualan;
                            });
                            value.products = productdas;
                        });

                        deferred.resolve(customers);
                    }
                    else
                    {
                        deferred.resolve([]);
                    } 
                });
            }
        },
        function(error) 
        {
            console.log("query SOT2 Gagal");
            deferred.resolve(error.message);
        });
        return deferred.promise;  
    }

    return{
            getSOT2Quantity:getSOT2Quantity,
            getSOT2Type:getSOT2Type,
            getSOT2SummaryPerCustomer:getSOT2SummaryPerCustomer,
            getSOT2SummaryAllCustomer:getSOT2SummaryAllCustomer
        }
}]);