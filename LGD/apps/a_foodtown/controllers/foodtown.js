angular.module('starter')
.controller('FoodtownSaleCtrl', function($window,$timeout,$rootScope,$scope, $state,$ionicPopup,$ionicLoading,UtilService,ChartsCustomerFac) 
{
	$ionicLoading.show
    ({
      template: 'Loading...'
    })
    .then(function()
    {
        ChartsCustomerFac.GetCustomerCharts()
        .then(function(response)
        {
            FusionCharts.ready(function () 
            {
                var ChartLayer = new FusionCharts({
                    type: 'column3d',
                    renderAt: 'chart-layer',
                    width: '100%',
                    dataFormat: 'json',
                    dataSource: response.Total_Layer
                });
                ChartLayer.render();

                var ChartGeo = new FusionCharts({
                    type: 'column3d',
                    renderAt: 'chart-geolocation',
                    width: '100%',
                    dataFormat: 'json',
                    dataSource: response.Total_Geo
                });
                ChartGeo.render();
            });
        })
		.finally(function()
		{
			$timeout(function()
	        {
	            $ionicLoading.hide();
	        },500);
		}); 
    });
})
.controller('FoodtownTenantCtrl', function($window,$timeout,$rootScope,$scope, $state,$ionicPopup,$ionicLoading,UtilService,ChartsCustomerFac) 
{
	$ionicLoading.show
    ({
      template: 'Loading...'
    })
    .then(function()
    {
        ChartsCustomerFac.GetCustomerCharts()
        .then(function(response)
        {
            FusionCharts.ready(function () 
            {
                var ChartLayer = new FusionCharts({
                    type: 'column3d',
                    renderAt: 'chart-layerx',
                    width: '100%',
                    dataFormat: 'json',
                    dataSource: response.Total_Layer
                });
                ChartLayer.render();

                var ChartGeo = new FusionCharts({
                    type: 'column3d',
                    renderAt: 'chart-geolocationx',
                    width: '100%',
                    dataFormat: 'json',
                    dataSource: response.Total_Geo
                });
                ChartGeo.render();
            });
        })
		.finally(function()
		{
			$timeout(function()
	        {
	            $ionicLoading.hide();
	        },500);
		}); 
    });
})
.controller('FoodtownMemberCtrl', function($window,$timeout,$rootScope,$scope, $state,$ionicPopup,$ionicLoading,UtilService,ChartsCustomerFac) 
{
	$ionicLoading.show
    ({
      template: 'Loading...'
    })
    .then(function()
    {
        ChartsCustomerFac.GetCustomerCharts()
        .then(function(response)
        {
            FusionCharts.ready(function () 
            {
                var ChartLayer = new FusionCharts({
                    type: 'column3d',
                    renderAt: 'chart-layery',
                    width: '100%',
                    dataFormat: 'json',
                    dataSource: response.Total_Layer
                });
                ChartLayer.render();

                var ChartGeo = new FusionCharts({
                    type: 'column3d',
                    renderAt: 'chart-geolocationy',
                    width: '100%',
                    dataFormat: 'json',
                    dataSource: response.Total_Geo
                });
                ChartGeo.render(); 
            });
        })
		.finally(function()
		{
			$timeout(function()
	        {
	            $ionicLoading.hide();
	        },500);
		}); 
    });
});