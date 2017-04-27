angular.module('starter')
.controller('EmployeCtrl', function($window,$scope,$state,$location,$timeout,$ionicLoading,$ionicHistory,StorageService) 
{

    
})
.controller('AbsensiCtrl', function($filter,$scope,$state,$location,$timeout,$ionicLoading,$ionicModal,$ionicHistory,$cordovaCamera,UtilService,StorageService,AbsensiLiteFac,EmployeFac) 
{
	EmployeFac.GetEmploye($scope.stores.OUTLET_CODE,$scope.profile.access_token)
	.then(function(responsegetserveremploye)
	{
		$scope.dataemploye = responsegetserveremploye;
	});

	$scope.openmodalabsensi	= function(item)	
    {
    	$ionicModal.fromTemplateUrl('templates/employe/modalabsensi.html', 
        {
            scope: $scope,
            animation: 'fade-in-scale',
            backdropClickToClose: false,
            hardwareBackButtonClose: false
        })
        .then(function(modal) 
        {
            var dataparams 	= {};
			dataparams.TGL_SAVE		= $filter('date')(new Date(),'yyyy-MM-dd');
			dataparams.EMP_ID		= item.EMP_ID;
			dataparams.USERNAME		= item.NAME;
			dataparams.OUTLET_CODE	= item.OUTLET_CODE;
			dataparams.ACCESS_UNIX	= item.ACCESS_UNIX;
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
			$scope.dataemployedetail	= item;
            $scope.modalabsensi  		= modal;
            $scope.modalabsensi.show();
        });
    }
    $scope.closemodalabsensi = function()
    {
    	$scope.modalabsensi.remove();
    }
    
    $scope.funcabsensi 	= function(masukataukeluar)
	{
		$scope.disablemasuk  = true;
       	$scope.disablekeluar = true;
		var datatosave 	= {};
		datatosave.TYPE_ABSENSI	= masukataukeluar;
        datatosave.OUTLET_CODE	= $scope.dataemployedetail.OUTLET_CODE;
        datatosave.EMP_ID		= $scope.dataemployedetail.EMP_ID;
        datatosave.USERNAME		= $scope.dataemployedetail.NAME;
        datatosave.ACCESS_UNIX	= $scope.dataemployedetail.ACCESS_UNIX;
        datatosave.LAT_POST		= 1234567890;
        datatosave.LNG_POST		= 1234567890;
        
        document.addEventListener("deviceready", function () 
        {
            var options = UtilService.CameraOptions();
            $cordovaCamera.getPicture(options)
            .then(function (imageData) 
            {
                datatosave.IMG_ABSENSI	= 'data:image/jpeg;base64,' + imageData;
                $ionicLoading.show
                ({
                    template: 'Loading...'
                })
                .then(function()
                {
                	AbsensiLiteFac.SetAbsensi(datatosave)
			        .then(function(responsesetabsensi)
			        {
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

			        	datatosave.WAKTU 		= $filter('date')(new Date(),'yyyy-MM-dd HH:mm:ss');
			        	datatosave.IMG_MASUK 	= datatosave.IMG_ABSENSI;
			        	EmployeFac.SetEmployeAbsensi(datatosave)
			        	.then(function(responsesetabsensiserver)
			        	{
			        		console.log(responsesetabsensiserver);
			        	},
			        	function(errorsetabsensiserver)
			        	{
			        		console.log(errorsetabsensiserver);
			        	});
			        },
			        function(errorsetabsensi)
			        {
			        	console.log(errorsetabsensi);
			        })
			        .finally(function()
		        	{
		        		$ionicLoading.show({template: 'Loading...',duration: 500});
		        	});
                });
            });
        }, false);

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
            $scope.notifikasiabsensimodal  = modal;
            $scope.notifikasiabsensimodal.show();
        });
	}

	$scope.tutupnotifikasi = function()
	{
		if($scope.modalabsensi)
		{
			$scope.modalabsensi.remove();
		}
		$scope.notifikasiabsensimodal.remove();
	}
});