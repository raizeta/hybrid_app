angular.module('starter')
.factory('JadwalFac',function($rootScope,$http,$q,$window,UtilService)
{
	
	var GetJadwal = function(ACCESS_UNIX)
    {
		var deferred 		   = $q.defer();
		// var url 			= "http://rt.kontrolgampang.com/login/user-tokens?username=x&email=piter@x.com";
		var url 			    = "http://rt.kontrolgampang.com/master/jadwal-junjungans";
		var method 			    = "GET";
		var params 			    = {};
		params["ACCESS_UNIX"]	= ACCESS_UNIX;
		$http({method:method, url:url,params:params,cache:true})
        .success(function(response) 
        {
	        deferred.resolve(response.jadwalkunjng);
        })
        .error(function(err,status)
        {
	        deferred.reject(err);
        });	

        return deferred.promise;  
    }
    var GetJadwalDetail = function(ACCESS_UNIX,TGL)
    {
        var deferred           = $q.defer();
        // var url          = "http://rt.kontrolgampang.com/login/user-tokens?username=x&email=piter@x.com";
        var url                 = "http://rt.kontrolgampang.com/master/jadwal-junjungans";
        var method              = "GET";
        var params              = {};
        params["ACCESS_UNIX"]   = ACCESS_UNIX;
        params["TGL"]           = TGL;
        params["expand"]        = "IMG_PEKERJA,Todolist";
        $http({method:method, url:url,params:params,cache:true})
        .success(function(response) 
        {
            deferred.resolve(response.jadwalkunjng);
        })
        .error(function(err,status)
        {
            deferred.reject(err);
        }); 

        return deferred.promise;  
    }
    var SetJadwal = function(datatosave)
    {
        var deferred            = $q.defer();
        var globalurl           = UtilService.ApiUrl();      
        var url                 = "http://rt.kontrolgampang.com/master/jadwal-junjungans";

        var result              = UtilService.SerializeObject(datatosave);
        var serialized          = result.serialized;
        var config              = result.config;

        $http.post(url,serialized,config)
        .success(function(dataresponse,status,headers,config) 
        {
            deferred.resolve(dataresponse);
        })
        .error(function(err,status)
        {
            deferred.reject(err);
        });
        return deferred.promise;  
    }
    var GetRatings = function(JADWAL_ID)
    {
        var deferred           = $q.defer();
        var url                 = "http://rt.kontrolgampang.com/master/ratings";
        var method              = "GET";
        var params              = {};
        params["JADWAL_ID"]     = JADWAL_ID;
        $http({method:method, url:url,params:params,cache:true})
        .success(function(response) 
        {
            deferred.resolve(response.rating);
        })
        .error(function(err,status)
        {
            deferred.reject(err);
        }); 

        return deferred.promise;  
    }
    var SetRatings = function(JADWAL_ID,NILAI_AWAL,NILAI,NILAI_KETERANGAN)
    {
        var deferred               = $q.defer();
        var url                    = "http://rt.kontrolgampang.com/master/ratings?JADWAL_ID=" + JADWAL_ID + "&NILAI=" + NILAI_AWAL;
        var method                 = "PUT";
        var params                 = {};
        params["JADWAL_ID"]        = JADWAL_ID;
        params["NILAI"]            = NILAI;
        params["NILAI_KETERANGAN"] = NILAI_KETERANGAN;

        var result              = UtilService.SerializeObject(params);
        var serialized          = result.serialized;
        var config              = result.config;
        $http.put(url,serialized,config)
        .success(function(response) 
        {
            deferred.resolve(response.rating);
        })
        .error(function(err,status)
        {
            deferred.reject(err);
        }); 

        return deferred.promise;  
    }
    return {
    	GetJadwal:GetJadwal,
        GetJadwalDetail:GetJadwalDetail,
    	SetJadwal:SetJadwal,
        GetRatings:GetRatings,
        SetRatings:SetRatings
    }
});