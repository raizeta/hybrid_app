angular.module('starter')
.controller('POPriceYearChartsCtrl', function($window,$timeout,$rootScope,$scope,$state,$ionicPopup,$ionicLoading,MenuService,ChartsPurchasesFac,StorageService) 
{
    $ionicLoading.show
    ({
      template: 'Loading...'
    })
    .then(function()
    {
        ChartsPurchasesFac.GetPOPrice()
        .then(function(response)
        {
            console.log(response);
            FusionCharts.ready(function() 
            {
                var conversionChartPOPriceYear = new FusionCharts(
                {
                    type: 'mscolumn3d',
                    renderAt: 'chart-po-price-year',
                    width: "100%",
                    dataFormat: 'json',
                    dataSource: response.PO_PriceYear
                });
                conversionChartPOPriceYear.render();
                $ionicLoading.hide();
            });
        });
    });
})

.controller('POStockYearChartsCtrl', function($window,$timeout,$rootScope,$scope,$state,$ionicPopup,$ionicLoading,MenuService,ChartsPurchasesFac,StorageService) 
{
    $ionicLoading.show
    ({
      template: 'Loading...'
    })
    .then(function()
    {
        ChartsPurchasesFac.GetPOPrice()
        .then(function(response)
        {
            FusionCharts.ready(function() 
            {
                var conversionChartPOPriceYear = new FusionCharts(
                {
                    type: 'mscolumn3d',
                    renderAt: 'chart-po-stock-year',
                    width: "100%",
                    dataFormat: 'json',
                    dataSource: response.PO_StockYear
                });
                conversionChartPOPriceYear.render();
                $ionicLoading.hide();
            });
        });
    });
})

.controller('POStockChartsCtrl', function($window,$timeout,$rootScope,$scope,$state,$ionicPopup,$ionicLoading,MenuService,ChartsPurchasesFac,StorageService) 
{
    $ionicLoading.show
    ({
      template: 'Loading...'
    })
    .then(function()
    {
        ChartsPurchasesFac.GetPOPrice()
        .then(function(response)
        {
            console.log(response);
            FusionCharts.ready(function() 
            {
                var conversionChartPOPriceYear = new FusionCharts(
                {
                    type: 'mscolumn3d',
                    renderAt: 'chart-po-stock',
                    width: "100%",
                    dataFormat: 'json',
                    dataSource: response.PO_Stock
                });
                conversionChartPOPriceYear.render();
                $ionicLoading.hide();
            });
        });
    });
})

.controller('POPriceChartsCtrl', function($window,$timeout,$rootScope,$scope,$state,$ionicPopup,$ionicLoading,MenuService,ChartsPurchasesFac,StorageService) 
{
    $ionicLoading.show
    ({
      template: 'Loading...'
    })
    .then(function()
    {
        ChartsPurchasesFac.GetPOPrice()
        .then(function(response)
        {
            console.log(response);
            FusionCharts.ready(function() 
            {
                var conversionChartPOPriceYear = new FusionCharts(
                {
                    type: 'mscolumn3d',
                    renderAt: 'chart-po-price',
                    width: "100%",
                    dataFormat: 'json',
                    dataSource: response.PO_Price
                });
                conversionChartPOPriceYear.render();
                $ionicLoading.hide();
            });
        });
    });
});

