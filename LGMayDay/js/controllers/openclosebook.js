angular.module('starter')
.controller('OpenBookCtrl', function($filter,$ionicLoading,$ionicHistory,$timeout,$scope,$state,$location,CloseBookLiteFac,ConstructorService) 
{
	var tglsekarang         = $filter('date')(new Date(),'yyyy-MM-dd');
    var IS_OPEN             = 1;
    var IS_CLOSE            = 0;
    CloseBookLiteFac.GetOpenCloseBook(tglsekarang,$scope.profile.ACCESS_UNIX,$scope.stores.OUTLET_CODE,IS_OPEN,IS_CLOSE)
    .then(function(responseclosebook)
    {
        console.log(responseclosebook);
        if(responseclosebook.length == 0)
        {
            $scope.openbookdata = ConstructorService.OpenBookConstructor();      
        }
        else
        {
            $scope.openbookdata = responseclosebook[responseclosebook.length - 1];
            if($scope.openbookdata.CHECKCASH == $scope.openbookdata.CASHINDRAWER)
            {
                $scope.openbookdata.status = 'true';
            }
            else
            {
                $scope.openbookdata.status = 'false';  
            }
            $scope.sudahopen = true;
        }
    },
    function(error)
    {
        console.log(error);
    });

    $scope.OpenBook = function(openbookdata)
    {
        if(openbookdata.status == 'true')
        {
        	openbookdata.CHECKCASH = openbookdata.CASHINDRAWER;
        }
        else
        {
        	openbookdata.CHECKCASH = Number(openbookdata.CHECKCASH);
        }

        CloseBookLiteFac.SetOpenCloseBook(openbookdata)
        .then(function(responseclosebook)
        {
            $scope.sudahopen = true;
            alert("Open Book Sukses");
        },
        function(error)
        {
            console.log(error);
        }); 
    }
})
.controller('CloseBookCtrl', function($filter,$ionicLoading,$ionicHistory,$ionicModal,$timeout,$scope,$state,UtilService,CloseBookLiteFac,SummaryLiteFac,ConstructorService)
{
	$scope.dataclosebook   = {'modalawal':0,'withdraw':0,'totalpendapatan':0,'grandtotal':0}             
	var tglsekarang        = $filter('date')(new Date(),'yyyy-MM-dd');
    var IS_OPEN             = 1;
    var IS_CLOSE            = 0;
    CloseBookLiteFac.GetOpenCloseBook(tglsekarang,$scope.profile.ACCESS_UNIX,$scope.stores.OUTLET_CODE,IS_OPEN,IS_CLOSE)
    .then(function(responseclosebook)
    {
        if(responseclosebook.length > 0)
        {
            var datawal = responseclosebook[responseclosebook.length - 1];
            $scope.dataclosebook.modalawal  = Number(datawal.CHECKCASH) + Number(datawal.ADDCASH);
            $scope.dataclosebook.id         = datawal.id;
            $scope.sudahclose = false;
            SummaryLiteFac.SumTransHeaderComplete($scope.profile.ACCESS_UNIX,$scope.stores.OUTLET_CODE,'COMPLETE',tglsekarang)
            .then(function(response)
            {
                var totalpendapatan = response[0].TOTAL;
                var grandtotal     = $scope.dataclosebook.modalawal + totalpendapatan;
                $scope.dataclosebook.totalpendapatan    = totalpendapatan;
                $scope.dataclosebook.grandtotal         = grandtotal
            });    
        }
        else
        {
            alert("Nothing To Close.Kamu Harus Melakukan Open Book Terlebih Dahulu");
            $scope.sudahclose = true;
        }
    },
    function(error)
    {
        console.log(error);
    });

    $scope.submitclosebook = function()
    {
    	var datatoupdate = {};
        datatoupdate.SELLCASH     = $scope.dataclosebook.totalpendapatan;
        datatoupdate.TOTALCASH    = Number($scope.dataclosebook.totalpendapatan) + Number($scope.dataclosebook.modalawal);
        datatoupdate.WITHDRAW     = Number($scope.dataclosebook.withdraw);
        datatoupdate.IS_CLOSE     = 1;
        datatoupdate.id           = $scope.dataclosebook.id;

        if(datatoupdate.WITHDRAW > datatoupdate.TOTALCASH)
        {
            alert("Uang Yang Akan Anda Tarik Melebihi Dari Dana Yang Tersedia.");
        }
        else
        {
            CloseBookLiteFac.UpdateOpenCloseBook(datatoupdate)
            .then(function(responseclosebook)
            {
        		$scope.sudahclose = true;
                alert("Close Book Sukses.")	
        	},
            function(error)
            {
                console.log(error);
            });

            $scope.setoran              = ConstructorService.SetoranConstructor();
            $scope.setoran.TTL_STORAN  += datatoupdate.WITHDRAW;
            CloseBookLiteFac.SetSetoranBook($scope.setoran)
            .then(function(responsesetsetoran)
            {
                console.log("Setoran Berhasil Disimpan Ke Local")
            },
            function(errorsetsetoran)
            {
                console.log(errorsetsetoran);
            });
        }
    }
})
.controller('NotifikasiCtrl', function($ionicLoading,$ionicHistory,$ionicModal,$timeout,$scope,$state,UtilService,CloseBookLiteFac,SummaryLiteFac)
{
    $scope.tutupnotifikasiclosebook = function()
    {
        $timeout(function() 
        {
            $ionicHistory.nextViewOptions({disableAnimate: true, disableBack: true});
            $state.go('tab.account');   
        }, 100);
    }
});
