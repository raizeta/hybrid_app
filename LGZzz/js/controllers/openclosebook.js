angular.module('starter')
.controller('OpenBookCtrl', function($ionicLoading,$ionicHistory,$timeout,$scope,$state,$location,CloseBookLiteFac) 
{
	CloseBookLiteFac.GetCloseBookByUsername($scope.profile.username)
    .then(function(responseclosebook)
    {
        if(responseclosebook.length == 0)
        {
            $scope.openbookdata = {'CASHINDRAWER':0,'status':'true','CHECKCASH':null,'ADDCASH':0,'SELLCASH':0,'TOTALCASH':0,'WITHDRAW':0};      
        }
        if (responseclosebook.length > 0 && responseclosebook.length < 2)
        {
            if(responseclosebook[responseclosebook.length - 1].NAMA_TYPE == 'OPENBOOK')
            {
                $timeout(function() 
                {
                    $ionicHistory.nextViewOptions({disableAnimate: true, disableBack: true});
                    $state.go('tab.sales'); 
                });
            }
        }
        else if (responseclosebook.length > 1)
        {
            if(responseclosebook[responseclosebook.length - 1].NAMA_TYPE == 'CLOSEBOOK')
            {
                $timeout(function() 
                {
                   $ionicHistory.nextViewOptions({disableAnimate: true, disableBack: true});
                   $state.go('tab.closebook', {}, {reload: true}); 
                });
                
            }  
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

        var datatosave = {};
        datatosave.USERNAME     = $scope.profile.username;
        datatosave.USER_ID      = $scope.profile.id;
        datatosave.NAMA_TYPE    = 'OPENBOOK';
        datatosave.CASHINDRAWER = openbookdata.CASHINDRAWER;
        datatosave.CHECKCASH    = openbookdata.CHECKCASH;
        datatosave.ADDCASH      = openbookdata.ADDCASH;
        datatosave.SELLCASH     = openbookdata.SELLCASH;
        datatosave.TOTALCASH    = openbookdata.TOTALCASH;
        datatosave.WITHDRAW     = openbookdata.WITHDRAW;
        CloseBookLiteFac.SetCloseBook(datatosave)
        .then(function(responseclosebook)
        {
            $timeout(function() 
            {
                $scope.$apply(function () 
                {
                    $ionicHistory.nextViewOptions({disableAnimate: true, disableBack: true});
                    $state.go('tab.sales');
                });
            }, 500);
         	console.log(responseclosebook);
        },
        function(error)
        {
            console.log(error);
        }); 
    }
})
.controller('CloseBookCtrl', function($ionicLoading,$ionicHistory,$ionicModal,$timeout,$scope,$state,UtilService,CloseBookLiteFac,SummaryLiteFac)
{
	$scope.dataclosebook = {'modalawal':0,'withdraw':null,'totalpendapatan':0,'grandtotal':0}             
	
    CloseBookLiteFac.GetCloseBookByUsername($scope.profile.username)
    .then(function(responseclosebook)
    {
        if (responseclosebook.length > 1)
        {
            if(responseclosebook[responseclosebook.length - 1].NAMA_TYPE == 'CLOSEBOOK')
            {
                $timeout(function() 
                {
                    $ionicHistory.nextViewOptions({disableAnimate: true, disableBack: true});
                    $state.go('tab.notifikasiclosebook');   
                }, 100);
            }  
        }
        else
        {
            var datawal = responseclosebook[responseclosebook.length - 1];
            $scope.dataclosebook.modalawal = Number(datawal.CHECKCASH) + Number(datawal.ADDCASH);    
        }
        
    },
    function(error)
    {
        console.log(error);
    });

    SummaryLiteFac.JoinTransWithShopCart()
    .then(function(response)
    {
        
        var totalpendapatan = UtilService.SumPriceWithQty(response,'ITEM_HARGA','QTY_INCART');
        var grandtotal 	   = $scope.dataclosebook.modalawal + totalpendapatan;
        $scope.dataclosebook.totalpendapatan 	= totalpendapatan;
        $scope.dataclosebook.grandtotal 		= grandtotal
    });

    $scope.submitclosebook = function()
    {
    	var datatosave = {};
        datatosave.USERNAME     = $scope.profile.username;
        datatosave.USER_ID      = $scope.profile.id;
        datatosave.NAMA_TYPE    = 'CLOSEBOOK';
        datatosave.SELLCASH     = $scope.dataclosebook.totalpendapatan;
        datatosave.TOTALCASH    = Number($scope.dataclosebook.totalpendapatan) + Number($scope.dataclosebook.modalawal);
        datatosave.WITHDRAW     = Number($scope.dataclosebook.withdraw);
        datatosave.CHECKCASH    = 0;
        datatosave.ADDCASH      = 0;
        datatosave.CASHINDRAWER = Number(datatosave.TOTALCASH) - Number(datatosave.WITHDRAW);
        if(datatosave.WITHDRAW > datatosave.TOTALCASH)
        {
            alert("Uang Yang Akan Anda Tarik Melebihi Dari Dana Yang Tersedia.");
        }
        else
        {
            CloseBookLiteFac.SetCloseBook(datatosave)
            .then(function(responseclosebook)
            {
        		$timeout(function() 
                {
                    $ionicHistory.nextViewOptions({disableAnimate: true, disableBack: true});
                    $state.go('tab.notifikasiclosebook');   
                }, 100);	
        	},
            function(error)
            {
                console.log(error);
            });
        }
    }

    $scope.cancelclosebook = function()
    {
        $timeout(function() 
        {
            $ionicHistory.nextViewOptions({disableAnimate: true, disableBack: true});
            $state.go('tab.sales');   
        }, 100);    
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
