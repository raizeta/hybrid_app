angular.module('starter')
.controller('EmployeCtrl', function($window,$scope,$state,$location,$timeout,$ionicLoading,$ionicHistory,StorageService) 
{

    
})
.controller('AbsensiCtrl', function($filter,$scope,$state,$location,$timeout,$ionicLoading,$ionicModal,$ionicHistory,StorageService,AbsensiLiteFac) 
{
	var profile = StorageService.get('profile');
	var store 	= StorageService.get('LokasiStore');

	var dataparams 	= {};
	dataparams.TGL_SAVE		= $filter('date')(new Date(),'yyyy-MM-dd');
	dataparams.USERNAME		= profile.username;
	dataparams.OUTLET_CODE	= store.OUTLET_CODE;
	dataparams.ACCESS_UNIX	= profile.ACCESS_UNIX;

	AbsensiLiteFac.GetAbsensi(dataparams)
	.then(function(responsegetabsensi)
	{
		if(angular.isArray(responsegetabsensi) && responsegetabsensi.length > 0)
		{
			var len = responsegetabsensi.length;
			if(responsegetabsensi[len - 1].TYPE_ABSENSI == 'MASUK')
			{
				$scope.disablemasuk 	= true;
				$scope.disablekeluar	= false;
			}
			else
			{
				$scope.disablemasuk 	= true;
				$scope.disablekeluar	= true;
				$scope.notifikasiabsensi();
			}
		}
		else
		{
			$scope.disablemasuk 	= false;
			$scope.disablekeluar	= true;
		}
	},
	function(errorgetabsensi)
	{
		console.log(errorgetabsensi);
	});
	$scope.funcabsensi 	= function(masukataukeluar)
	{
		$scope.disablemasuk  = true;
       	$scope.disablekeluar = true;
		var datatosave 	= {};
		datatosave.TYPE_ABSENSI	= masukataukeluar;
        datatosave.OUTLET_CODE	= store.OUTLET_CODE;
        datatosave.USERNAME		= profile.username;
        datatosave.ACCESS_UNIX	= profile.ACCESS_UNIX;
        datatosave.IMG_ABSENSI	= 'img/check.png';
        datatosave.LAT_POST		= 1234567890;
        datatosave.LNG_POST		= 1234567890;
        AbsensiLiteFac.SetAbsensi(datatosave)
        .then(function(responsesetabsensi)
        {
        	console.log(responsesetabsensi);
        	if(masukataukeluar == 'MASUK')
        	{
        		$scope.disablemasuk  = true;
        		$scope.disablekeluar = false;
        	}
        	else
        	{
        		$scope.disablemasuk  = true;
        		$scope.disablekeluar = true;
        		$scope.notifikasiabsensi();
        	}
        },
        function(errorsetabsensi)
        {
        	console.log(errorsetabsensi);
        });
	}

	$scope.notifikasiabsensi 	= function()
	{
		$ionicModal.fromTemplateUrl('templates/employe/notifikasiabsensi.html', 
        {
            scope: $scope,
            animation: 'fade-in-scale',
            backdropClickToClose: false,
            hardwareBackButtonClose: false
        })
        .then(function(modal) 
        {
            $ionicLoading.show({template: 'Loading...',duration: 500});
            $scope.notifikasiabsensi  = modal;
            $scope.notifikasiabsensi.show();
        });
	}

	$scope.tutupnotifikasi = function()
	{
		$scope.notifikasiabsensi.remove();
	}
    
});;