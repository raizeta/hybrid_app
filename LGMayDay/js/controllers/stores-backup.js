angular.module('starter')
.controller('StoresCtrl', function($ionicHistory,$scope,$timeout,$state,$filter,StorageService,SecuredFac,StoreFac,StoreLiteFac,StoreCombFac,BarangForSaleLiteFac,HargaLiteFac,DiskonLiteFac,StoreLiteFac) 
{
	var profile = StorageService.get('profile');
	SecuredFac.UserProfile(profile.username,profile.access_token)
	.then(function(response)
	{
		console.log('Get User Profile Sukses');
	},
	function(error)
	{
		console.log(error);
	});
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
		paramsstorecheck.TGL_SAVE		= $filter('date')(new Date(),'yyyy-MM-dd');
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
					var datatosave 			= {};
					datatosave.TGL_SAVE		= $filter('date')(new Date(),'yyyy-MM-dd');
			        datatosave.ITEM_ID		= value.ITEM_ID;
			        datatosave.ITEM_NM		= value.ITEM_NM;
			        datatosave.OUTLET_CODE	= value.OUTLET_CODE;
			        datatosave.ITEM_HARGA 	= value.DEFAULT_HARGA;
			        datatosave.STOCK_MAX 	= 100;
			        datatosave.IS_ONSERVER  = 1;
			        if(value.GAMBAR)
			        {
		        		datatosave.GAMBAR 		= value.GAMBAR;	
			        }
			        else
			        {
			        	datatosave.GAMBAR 		= "img/bika-ambon.jpg";
			        }
			        
			        datatosave.FORMULA		= '';
			        datatosave.SATUAN		= value.SATUAN;
			        datatosave.STATUS		= value.STATUS;
			        angular.forEach(value.HARGA,function(valueharga,keyharga)
			        {
			        	var datahargatosave 	= {};
			        	datahargatosave.ITEM_ID			= datatosave.ITEM_ID;
				        datahargatosave.OUTLET_CODE		= datatosave.OUTLET_CODE;
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
				        function(errorharga)
				        {
				        	console.log(errorharga);
				        });
			        });

			        angular.forEach(value.DISCOUNT,function(valuediskon,keydiskin)
			        {
			        	var datadiskontosave = {};
			        	datadiskontosave.ITEM_ID			= datatosave.ITEM_ID;
				        datadiskontosave.OUTLET_CODE		= datatosave.OUTLET_CODE;
				        datadiskontosave.DISCOUNT_PERCENT	= valuediskon.DISCOUNT_PERCENT;
				        datadiskontosave.MAX_DISCOUNT 		= valuediskon.MAX_DISCOUNT;
				        datadiskontosave.PERIODE_TGL1		= valuediskon.PERIODE_TGL1;
				        datadiskontosave.PERIODE_TGL2		= valuediskon.PERIODE_TGL2;
				        datadiskontosave.PERIODE_TIME1		= valuediskon.PERIODE_TIME1;
				        datadiskontosave.PERIODE_TIME2		= valuediskon.PERIODE_TIME2;
				        datadiskontosave.START_TIME			= valuediskon.START_TIME;
				        datadiskontosave.DCRIPT 			= valuediskon.DCRIPT;
				        DiskonLiteFac.SetDiskon(datadiskontosave)
				        .then(function(responsesetdiskon)
				        {
				        	console.log(responsesetdiskon);
				        },
				        function(errordiskon)
				        {
				        	console.log(errordiskon);
				        })
			        })
			        
			        BarangForSaleLiteFac.SetBarangForSale(datatosave)
			        .then(function(responsesetbarang)
			        {
			        	console.log(responsesetbarang);
			        },
			        function(error)
			        {
			        	console.log(error);
			        });
				});
				StoreLiteFac.SetStoreCheck(paramsstorecheck)
				.then(function(responsesetstorecheck)
				{
					console.log(responsesetstorecheck);
				},
				function(errorsetstorecheck)
				{
					console.log(errorsetstorecheck);
				})	
			}
			else
			{
				console.log("Sudah Di Check");
			}
		},
		function(errorgetstorecheck)
		{
			console.log(errorgetstorecheck);
		});

		$timeout(function() 
		{
			$ionicHistory.nextViewOptions({disableAnimate: true, disableBack: true});
			StorageService.set('LokasiStore',stores.lokasistore);
			$state.go('tab.sales');
		}, 50);	
	}	
});