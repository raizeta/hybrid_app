'use strict';
myAppModule.factory('ExpiredSqliteServices', ["$rootScope","$http","$q","$filter","$window","$cordovaSQLite",
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

    var getSqliteExpired = function (ID_DETAIL)
    {
        var deferred    = $q.defer();
        var url         = getUrl();
        var queryexpired = 'SELECT * FROM Expiredbarang WHERE ID_DETAIL = ?';
        $cordovaSQLite.execute($rootScope.db, queryexpired, [ID_DETAIL])
        .then(function(result) 
        {
            if (result.rows.length > 0) 
            {
                var resultbaranged = [];
                var l = result.rows.length;
                for (var i=0; i < l; i++) 
                {
                    var KD_BARANG    = result.rows.item(i).BRG_ID;
                    resultbaranged.push(KD_BARANG);
                }
                deferred.resolve(resultbaranged);
            }
            else
            {
                $http.get(url + "/expiredproducts/search?ID_DETAIL=" + ID_DETAIL)
                .success(function(response,status,headers,config) 
                {
                    if(angular.isDefined(response.statusCode))
                    {
                        deferred.resolve([]);
                    }
                    else
                    {
                        var expired = response.ExpiredProduct;
                        var resultbaranged = [];
                        angular.forEach(expired, function(value, key)
                        {
                            var TGL_KJG             = $filter('date')(value.TGL_KJG,'yyyy-MM-dd');

                            var newID_SERVER            = value.ID;
                            var newID_PRIORITASED       = value.ID_PRIORITASED;
                            var newID_DETAIL            = value.ID_DETAIL;
                            var newCUST_ID              = value.CUST_ID;
                            var newBRG_ID               = value.BRG_ID;
                            var newUSER_ID              = value.USER_ID;
                            var newTGL_KJG              = TGL_KJG;
                            var newQTY                  = value.QTY;
                            var newDATE_EXPIRED         = value.DATE_EXPIRED;
                            var newISON_SERVER          = 1;

                            var isitable = [newID_SERVER,newID_PRIORITASED,newID_DETAIL,newCUST_ID,newBRG_ID,newUSER_ID,newTGL_KJG,newQTY,newDATE_EXPIRED,newISON_SERVER]
                            var queryinserted = 'INSERT INTO Expiredbarang (ID_SERVER,ID_PRIORITASED,ID_DETAIL,CUST_ID,BRG_ID,USER_ID,TGL_KJG,QTY,DATE_EXPIRED,ISON_SERVER) VALUES (?,?,?,?,?,?,?,?,?,?)';
                            $cordovaSQLite.execute($rootScope.db,queryinserted,isitable)
                            .then(function(result)
                            {
                                console.log("Sukses Save Barang Expired Ke Local");
                            },
                            function (error)
                            {
                                alert("Gagal Save Barang Expired Ke Local");
                            });

                            var KD_BARANG = value.BRG_ID;
                            resultbaranged.push(KD_BARANG);
                        });
                        var buatjadiunikbaranged = $rootScope.unique(resultbaranged);
                        deferred.resolve(buatjadiunikbaranged);
                    }
                })
                .error(function(err)
                {
                    deferred.reject(err);
                });
            }
        },
        function (error)
        {
            alert("Gagal Mendapatkan Data Barang Expired Dari Local");
            deferred.rejected(error); 
        });
        return deferred.promise;
    }

    var setSqliteExpired = function (detailexpired,dataid)
    {
        var deferred = $q.defer();
        var newID_SERVER            = detailexpired.ID;
        var newID_PRIORITASED       = detailexpired.ID_PRIORITASED;
        var newID_DETAIL            = detailexpired.ID_DETAIL;
        var newCUST_ID              = detailexpired.CUST_ID;
        var newBRG_ID               = detailexpired.BRG_ID;
        var newUSER_ID              = detailexpired.USER_ID;
        var newTGL_KJG              = $filter('date')(detailexpired.TGL_KJG,'yyyy-MM-dd');
        var newQTY                  = detailexpired.QTY;
        var newDATE_EXPIRED         = detailexpired.DATE_EXPIRED;
        var newISON_SERVER          = 1;

        var isitable = [newID_SERVER,newID_PRIORITASED,newID_DETAIL,newCUST_ID,newBRG_ID,newUSER_ID,newTGL_KJG,newQTY,newDATE_EXPIRED,newISON_SERVER]
        var queryinserted = 'INSERT INTO Expiredbarang (ID_SERVER,ID_PRIORITASED,ID_DETAIL,CUST_ID,BRG_ID,USER_ID,TGL_KJG,QTY,DATE_EXPIRED,ISON_SERVER) VALUES (?,?,?,?,?,?,?,?,?,?)';
        $cordovaSQLite.execute($rootScope.db,queryinserted,isitable)
        .then(function(result)
        {
            console.log("Sukses Save Barang Expired Ke Local");
            deferred.resolve(result);
        },
        function (error)
        {
            alert("Gagal Save Barang Expired Ke Local");
            deferred.rejected(error);
        });

        return deferred.promise;
    }
    
    return{
            getSqliteExpired:getSqliteExpired,
            setSqliteExpired:setSqliteExpired
        }
}]);