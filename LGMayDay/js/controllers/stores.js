angular.module('starter')
.controller('StoresCtrl', function($ionicHistory,$ionicLoading,$scope,$timeout,$state,$filter,StorageService,SecuredFac,StoreFac,StoreLiteFac,StoreCombFac,TransaksiCombFac,CustomerCombFac,BarangForSaleLiteFac,HargaLiteFac,DiskonLiteFac,StoreLiteFac) 
{
	var profile 	= StorageService.get('profile');
	var tglsekarang = $filter('date')(new Date(),'yyyy-MM-dd');
	StoreCombFac.GetStoreComb(profile.ACCESS_UNIX,profile.access_token)
	.then(function(responsegetcombstore)
	{
		console.log(responsegetcombstore);
	},
	function(errorgetcombstore)
	{
		console.log(errorgetcombstore);	
	});

	StoreFac.GetBearerStoresItem(profile.ACCESS_UNIX,profile.access_token)
	.then(function(responsestore)
	{
		console.log('Get Stores With Item Sukses');
		$scope.datastore = responsestore;
	},
	function(errorgetbearerstore)
	{
		console.log(errorgetbearerstore);
	});

	$scope.choosestore = function(stores)
	{
		var paramsstorecheck		 	= {};
		paramsstorecheck.TGL_SAVE		= tglsekarang;
		paramsstorecheck.OUTLET_CODE	= stores.lokasistore.OUTLET_CODE;
		paramsstorecheck.USERNAME 		= profile.username;
		paramsstorecheck.ACCESS_UNIX	= profile.ACCESS_UNIX;
		StoreLiteFac.GetStoreCheck(paramsstorecheck)
		.then(function(responsegetstorecheck)
		{
			if(angular.isArray(responsegetstorecheck) && responsegetstorecheck.length == 0)
			{
				angular.forEach(stores.lokasistore.items,function(value,key)
				{
					value.TGL_SAVE			= $filter('date')(new Date(),'yyyy-MM-dd');
					value.DEFAULT_STOCK 	= value.DAFAULT_STOCK;
					value.DEFAULT_DISCOUNT 	= 0;
					value.DEFAULT_IMAGE 	= "img/bika-ambon.jpg";
					value.IS_ONSERVER 		= 1;
			        BarangForSaleLiteFac.SetBarangForSale(value)
			        .then(function(responsesetbarang)
			        {
			        	console.log(responsesetbarang);
			        },
			        function(error)
			        {
			        	console.log(error);
			        });
				});
				
				TransaksiCombFac.GetTransCustsHeaderComb(tglsekarang,profile.ACCESS_UNIX,stores.lokasistore.OUTLET_CODE,profile.access_token)
				.then(function(responsegettransheader)
				{
					console.log(responsegettransheader);
				});

				CustomerCombFac.GetCustomerComb(profile.ACCESS_UNIX,stores.lokasistore.OUTLET_CODE,profile.access_token)
				.then(function(responsegetcustomer)
				{
					console.log(responsegetcustomer);
				},
				function(errorgetcustomer)
				{
					console.log(errorgetcustomer);
				})

				StoreLiteFac.SetStoreCheck(paramsstorecheck)
				.then(function(responsesetstorecheck)
				{
					console.log(responsesetstorecheck);
				});

				TransaksiCombFac.GetSetoranBookComb(tglsekarang,profile.ACCESS_UNIX,stores.lokasistore.OUTLET_CODE,STATUS = 1,IS_ONSERVER = 1,profile.access_token)
				.then(function(responsesetoranbook)
				{
					console.log(responsesetoranbook);
				},
				function(errorsetoranbook)
				{
					console.log(errorsetoranbook);
				});
				$scope.outtime = 5000;
			}
			else
			{
				console.log("Sudah Di Check");
				$scope.outtime = 1000;
			}
			$ionicLoading.show({template: 'Loading...',duration:$scope.outtime});
			$timeout(function() 
			{
				$ionicHistory.nextViewOptions({disableAnimate: true, disableBack: true});
				StorageService.set('LokasiStore',stores.lokasistore);
				$state.go('tab.sales');
			}, $scope.outtime);
		},
		function(errorgetstorecheck)
		{
			console.log(errorgetstorecheck);
		});
		
			
	}	
});