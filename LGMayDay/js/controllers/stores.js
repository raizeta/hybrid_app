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
		if(stores)
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
					angular.forEach(stores.lokasistore.items,function(valueitems,key)
					{
						valueitems.TGL_SAVE			= $filter('date')(new Date(),'yyyy-MM-dd');
						valueitems.DEFAULT_STOCK 	= valueitems.DAFAULT_STOCK;
						valueitems.DEFAULT_DISCOUNT = 0;
						valueitems.DEFAULT_IMAGE 	= "img/bika-ambon.jpg";
						valueitems.IS_ONSERVER 		= 1;

						angular.forEach(valueitems.HARGA,function(valueharga,keyharga)
				        {
				        	var datahargatosave 	= {};
				        	datahargatosave.ITEM_ID			= valueitems.ITEM_ID;
					        datahargatosave.OUTLET_CODE		= valueitems.OUTLET_CODE;
					        datahargatosave.ITEM_HARGA		= valueharga.HARGA_JUAL;
					        datahargatosave.PERIODE_TGL1 	= valueharga.PERIODE_TGL1;
					        datahargatosave.PERIODE_TGL2 	= valueharga.PERIODE_TGL2;
					        datahargatosave.START_TIME 		= valueharga.START_TIME;
					        datahargatosave.DCRIPT			= valueharga.DCRIPT;
				        	HargaLiteFac.SetHarga(datahargatosave)
					        .then(function(responsesetharga)
					        {
					        	console.log(responsesetharga);
					        },
					        function(errorsetharga)
					        {
					        	console.log(errorsetharga);
					        });
				        });

				        angular.forEach(valueitems.DISCOUNT,function(valuediskon,keydiskon)
				        {
				        	var datadiskontosave = {};
				        	datadiskontosave.ITEM_ID			= valueitems.ITEM_ID;
					        datadiskontosave.OUTLET_CODE		= valueitems.OUTLET_CODE;
					        datadiskontosave.DISCOUNT_PERCENT	= valuediskon.DISCOUNT_PERCENT;
					        datadiskontosave.MAX_DISCOUNT 		= valuediskon.MAX_DISCOUNT;
					        datadiskontosave.PERIODE_TGL1		= valuediskon.PERIODE_TGL1;
					        datadiskontosave.PERIODE_TGL2		= valuediskon.PERIODE_TGL2;
					        datadiskontosave.PERIODE_TIME1		= valuediskon.PERIODE_TIME1;
					        datadiskontosave.PERIODE_TIME2		= valuediskon.PERIODE_TIME2;
					        datadiskontosave.START_TIME			= valuediskon.START_TIME;
					        datadiskontosave.DCRIPT 			= valuediskon.DCRIPT;
					        datadiskontosave.STATUS 			= valuediskon.STATUS;
					        datadiskontosave.IS_ONSERVER 		= 1;
					        DiskonLiteFac.SetDiskon(datadiskontosave)
					        .then(function(responsesetdiskon)
					        {
					        	console.log(responsesetdiskon);
					        },
					        function(errorsetdiskon)
					        {
					        	console.log(errorsetdiskon);
					        })
				        });

				        angular.forEach(valueitems.IMAGE,function(valueimage,keyimage)
				        {
				        	var png  = valueimage.IMG64.search("data:image/png;base64");
				        	var jpg  = valueimage.IMG64.search("data:image/jpg;base64");
				        	
				        	var dataimagetosave 	= {};
				        	dataimagetosave.ITEM_ID			= valueitems.ITEM_ID;
					        dataimagetosave.OUTLET_CODE		= valueitems.OUTLET_CODE;
					        dataimagetosave.CREATE_AT		= valueimage.CREATE_AT;
					        dataimagetosave.UPDATE_AT 		= valueimage.UPDATE_AT;
					        if((png == -1) && (jpg == -1))
				        	{
				        		dataimagetosave.IMG64 = 'data:image/png;base64,' + valueimage.IMG64;
				        	}
				        	else
				        	{
				        		dataimagetosave.IMG64 			= valueimage.IMG64;
				        	}
					        dataimagetosave.IS_ONSERVER 	= 1;
				        	BarangForSaleLiteFac.SetBarangImageForSale(dataimagetosave)
					        .then(function(responsesetimage)
					        {
					        	console.log(responsesetimage);
					        },
					        function(errorsetimage)
					        {
					        	console.log(errorsetimage);
					        });
				        });

				        BarangForSaleLiteFac.SetBarangForSale(valueitems)
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
		
			
	}	
});