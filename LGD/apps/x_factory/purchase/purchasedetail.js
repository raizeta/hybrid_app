angular.module('starter')
.factory('PurchaseDetailFac',function($rootScope,$http,$q,$window,UtilService)
{
	var globalurl 		= UtilService.ApiUrl();
	var SearchPurchaseDetails = function(KD_PO)
    {
		var deferred 		= $q.defer();
		var url = globalurl + "/lgerp/purchasedetails/search?KD_PO=" + KD_PO;
		var method ="GET";
		$http({method:method, url:url,cache:false})
        .success(function(response) 
        {
	        var result = [];
	        angular.forEach(response.PurchaseDetail, function(value,key)
	        {
	        	if(value.STATUS == 1)
	        	{
	        		value.checked = true;	
	        	}
	        	else
	        	{
	        		value.checked = false;
	        	}
	        	result.push(value);
	        });
	        deferred.resolve(result);
        })
        .error(function(err,status)
        {
	        deferred.reject(err);
        });	
        return deferred.promise;  
    }
	var GetPurchaseDetails = function()
    {
		var deferred 		= $q.defer();
		var url = globalurl + "/lgerp/purchasedetails";
		var method ="GET";
		$http({method:method, url:url,cache:false})
        .success(function(response) 
        {
	        deferred.resolve(response.PurchaseDetail);
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
    var GetPurchaseDetail = function($id)
    {
		var deferred 		= $q.defer();
		var url 			= globalurl + "/lgerp/purchasedetails/" + $id;
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
    var CreatePurchaseDetail = function()
    {
		var deferred 		= $q.defer();
		var url = globalurl + "/lgerp/purchasedetails";
		var method ="POST";
		$http({method:method, url:url,cache:false})
        .success(function(response) 
        {
	        deferred.resolve(result);
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
    var UpdatePurchaseDetail = function(item)
    {
		var detail = {STATUS:0,STATUS_DATE:$rootScope.tanggalwaktuharini,NOTE:"Tested By Radumta"};
		if(item.checked)
		{
			detail.STATUS = 1;
		}
		var deferred 	= $q.defer();
		var url 		= globalurl + "/lgerp/purchasedetails/" + item.ID;
		var serialize 	= UtilService.SerializeObject(detail);
		var serialized 	= serialize.serialized;
        var config		= serialize.config;
		$http.put(url,serialized,config)
        .success(function(data,status, headers, config) 
        {
            deferred.resolve(data);
        })	

        return deferred.promise;  
    }
    var DeletePurchaseDetail = function($id)
    {
		var deferred 		= $q.defer();
		var url = globalurl + "/lgerp/purchasedetails/" + $id;
		var method ="DELETE";
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
			SearchPurchaseDetails:SearchPurchaseDetails,
			GetPurchaseDetails:GetPurchaseDetails,
			GetPurchaseDetail:GetPurchaseDetail,
			CreatePurchaseDetail:CreatePurchaseDetail,
			UpdatePurchaseDetail:UpdatePurchaseDetail,
			DeletePurchaseDetail:DeletePurchaseDetail
		}
});