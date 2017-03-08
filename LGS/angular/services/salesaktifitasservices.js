'use strict';
myAppModule.factory('SalesAktifitas', ["$rootScope","$http","$q","$filter","$window","ProductService","SOT2Services",
function($rootScope,$http, $q, $filter, $window, ProductService,SOT2Services)
{
    var getUrl = function()
    {
        return "http://api.lukisongroup.com/master";
    }
    var gettoken = function()
    {
        return "?access-token=azLSTAYr7Y7TLsEAML-LsVq9cAXLyAWa";
    }
    
    var getSalesAktifitas = function(CUST_ID,PLAN_TGL_KUNJUNGAN,resolveobjectbarang,resolvesot2type)
    {
        var globalurl       = getUrl();
        var deferred        = $q.defer();

        var databarang = resolveobjectbarang;
        var salesaktivitas = [];
        var i = 0;
        
        angular.forEach(resolvesot2type, function(value, key)
        {
            SOT2Services.getSOT2Quantity(CUST_ID,PLAN_TGL_KUNJUNGAN,value.SO_ID)
            .then (function (response)
            {
                var barangaksi = response;
                var diffbarangresult = [];
                angular.forEach(barangaksi, function(value, key)
                {
                    var existingFilter = _.findWhere(databarang, { KD_BARANG: value });
                    diffbarangresult.push(existingFilter);
                });
                var diffbarang = _.difference(databarang,diffbarangresult);
                if(diffbarang.length == 0)
                {
                    var status={};
                    status.bgcolor="bg-green";
                    status.icon="fa fa-check bg-green";
                    status.show = true;
                }
                else
                {
                    var status={};
                    status.bgcolor="bg-aqua";
                    status.icon="fa fa-close bg-aqua";
                    status.show = true;
                }
                
                resolvesot2type[i].products  = diffbarang;  
                resolvesot2type[i].status    = status;
                
                salesaktivitas.push(resolvesot2type[i]);
                i = i + 1;
            });
        });
        deferred.resolve(salesaktivitas);

        return deferred.promise;
    }

    var setMemoSalesAktifitas = function(salesmanmemo)
    {
        var url = getUrl();
        var deferred = $q.defer();

        var result              = $rootScope.seriliazeobject(salesmanmemo);
        var serialized          = result.serialized;
        var config              = result.config;

        $http.post(url + "/messageskunjungans",serialized,config)
        .success(function(data,status, headers, config) 
        {
            var statusmemokunjungan                         = {};

            statusmemokunjungan.bgcolor                     = "bg-green";
            statusmemokunjungan.icon                        = "fa fa-check bg-green";
            statusmemokunjungan.messageskunjungandisabled   = true;

            deferred.resolve(statusmemokunjungan);
        })
        .error(function(err)
        {
            deferred.reject(err);
        });

        return deferred.promise;
    }
    
    var getMemoSalesAktifitas = function(ID_DETAIL)
    {
        var url = getUrl();
        var deferred = $q.defer();

        $http.get(url + "/messageskunjungans/search?ID_DETAIL=" + ID_DETAIL)
        .success(function(response,status, headers, config) 
        {
            if(angular.isDefined(response.statusCode))
            {
                deferred.resolve([]);
            }
            else
            {
                var statusmemokunjungan                         = {};
                statusmemokunjungan.ISI_MESSAGES                = response.Messageskunjungan[0].ISI_MESSAGES;
                statusmemokunjungan.bgcolor                     = "bg-green";
                statusmemokunjungan.icon                        = "fa fa-check bg-green";
                statusmemokunjungan.messageskunjungandisabled   = true;
                deferred.resolve(statusmemokunjungan); 
            }
        })
        .error(function(err)
        {
            deferred.reject(err);
        });
        
        return deferred.promise;
    }
    
    return{
            getSalesAktifitas:getSalesAktifitas,
            setMemoSalesAktifitas:setMemoSalesAktifitas,
            getMemoSalesAktifitas:getMemoSalesAktifitas
        }
}]);