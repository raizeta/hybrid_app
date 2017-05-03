angular.module('starter')
.controller('ControlStoresCtrl', function($ionicModal,$ionicLoading,$ionicHistory,$scope,$timeout,$state,$filter,StorageService,UtilService,SecuredFac,StoreFac,BarangForSaleLiteFac,HargaLiteFac,DiskonLiteFac,StoreLiteFac) 
{
	StoreFac.GetBearerStoresItem($scope.profile.ACCESS_UNIX,$scope.profile.access_token)
	.then(function(responsestore)
	{
		$scope.datastore = responsestore;
		$scope.detailstore($scope.datastore[0]);
	},
	function(errorgetbearerstore)
	{
		console.log(errorgetbearerstore);
	});

	$scope.detailstore 	= function(item)
	{
		$scope.showbasic	= false;
		$scope.showproduct	= true;
		$scope.showmerchant	= false;
		$scope.showemploye	= false;
		$scope.datadetail 	= angular.copy(item);
		
		if ($scope.isGroupShown(item)) 
	    {
	      // $scope.shownGroup = null;
	    } 
	    else 
	    {
	      $scope.shownGroup = item;
	    }
	}

	$scope.modaltambahstoreopen = function()
	{
		$ionicModal.fromTemplateUrl('templates/control/modaltambahstore.html', 
        {
            scope: $scope,
            animation: 'fade-in-scale',
            backdropClickToClose: false,
            hardwareBackButtonClose: false
        })
        .then(function(modal) 
        {
            $scope.newstore = {'OUTLET_NM':null,'ALAMAT':null,'TLP':null,'PIC':null};
            $scope.tambahstore  = modal;
            $scope.tambahstore.show();
        });
	}
	$scope.modaltambahstoresubmit = function() 
    {
        var lastoutletcode     		= $scope.datastore[$scope.datastore.length - 1].OUTLET_CODE;
        var newoutletcode      		= UtilService.StringPad(Number(lastoutletcode) + 1,'0000');
        $scope.newstore.OUTLET_CODE	= newoutletcode;
        $scope.datastore.push($scope.newstore);
        $scope.detailstore($scope.newstore);
        $scope.tambahstore.remove();
    };
	$scope.modaltambahstoreclose = function() 
    {
        $scope.tambahstore.remove();
    };

    $scope.modaltambahproductopen 	= function()
    {
    	
    	if($scope.datadetail)
    	{
	    	$ionicModal.fromTemplateUrl('templates/control/modaltambahproduct.html', 
	        {
	            scope: $scope,
	            animation: 'fade-in-scale',
	            backdropClickToClose: false,
	            hardwareBackButtonClose: false
	        })
	        .then(function(modal) 
	        {
	            BarangForSaleLiteFac.GetBarangForSaleByDate($filter('date')(new Date(),'yyyy-MM-dd'))
			    .then(function(responseproducts)
			    {
			        if(angular.isArray(responseproducts) && responseproducts.length > 0)
			        {
			            $scope.datasproducts 	= responseproducts;
			            angular.forEach($scope.datasproducts,function(value,key)
			            {
			                var index = _.findIndex($scope.datadetail.items,{'ITEM_ID':value.ITEM_ID});
			                if(index > -1)
			                {
			                	value.checked = true;
			                }
			                else
			                {
			                	value.checked = false;	
			                }
			                
			            });
			 			
			        }
			        else
			        {
			            $scope.datasproducts = [];
			            alert("Product Masih Kosong");
			        }
			    });
			    $scope.selectradio 		= {'value':null};
	            $scope.tambahproduct  	= modal;
        		$scope.tambahproduct.show();  
	        });

	    }
	    else
	    {
	    	alert("Pilih Store Terlebih Dahulu");
	    }
    }
    $scope.modaltambahproductsubmit = function() 
    {
  		var products = [];
  		angular.forEach($scope.datasproducts,function(value,key)
  		{
  			if(value.checked)
  			{
  				products.push(value);
  			}
  		});
  		var index = _.findIndex($scope.datastore,{'OUTLET_CODE':$scope.datadetail.OUTLET_CODE});
  		$scope.datastore[index].items 	= products;
  		$scope.datadetail.items 		= products;
  		$scope.tambahproduct.remove();  
    };
	$scope.modaltambahproductclose = function() 
    {
        $scope.tambahproduct.remove();
    };
    $scope.radiochange = function(dataselect)
    {
    	if(dataselect == 'select')
    	{
    		$scope.chex = true;
    	}
    	else
    	{
    		$scope.chex = false;
    	}
		angular.forEach($scope.datasproducts,function(value,key)
		{
			value.checked = $scope.chex;
		});
    }
    
    // $scope.$watch('datasproducts', function() 
    // {
    //     if($scope.datasproducts)
    //     {
    //     	var no = 0;
	   //      for(var i = 0; i < $scope.datasproducts.length; i++) 
	   //      {
	   //          if($scope.datasproducts[i].checked === true)
	   //          {
	   //              no++;
	   //          }
	   //      }
	   //      if(no == 0)
	   //      {
	   //      	$scope.selectradio.value = 'unselectall';
	   //      }
	   //      else if(no == $scope.datasproducts.length)
	   //      {
	   //      	$scope.selectradio.value = 'selectall';
	   //      }
	   //      else
	   //      {
	   //      	$scope.selectradio.value = undefined;
	   //      }	
    //     }
    // }, true);

	$scope.toggleGroup = function(datatoshow) 
	{
		if(datatoshow == 'basic')
		{
			$scope.showbasic 	= !$scope.showbasic;
			$scope.showmerchant	= false;
			$scope.showproduct	= false;
			$scope.showemploye	= false;	
		}
		else if(datatoshow == 'product')
		{
			$scope.showbasic	= false;
			$scope.showmerchant	= false;
			$scope.showemploye	= false;
			$scope.showproduct	= !$scope.showproduct;
		}
		else if(datatoshow == 'merchant')
		{
			$scope.showbasic	= false;
			$scope.showproduct	= false;
			$scope.showemploye	= false;
			$scope.showmerchant	= !$scope.showmerchant;
		}
		else if(datatoshow == 'employe')
		{
			$scope.showbasic	= false;
			$scope.showproduct	= false;
			$scope.showmerchant	= false;
			$scope.showemploye	= !$scope.showemploye;
		}
	};
	$scope.isGroupShown = function(datatoshow) 
	{
		return $scope.shownGroup === datatoshow;
	};	
});