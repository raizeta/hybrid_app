angular.module('starter')
.config(function ($stateProvider, $urlRouterProvider,$ionicConfigProvider,$httpProvider)
{
    $stateProvider.state('main.chartpurchases', 
    {
      url: '/chartpurchases',
      abstract: true,
      views: 
      {
          'charts-tab': 
          {
            templateUrl: 'apps/a_charts/views/purchases/main.html',
          }
      }
    });
    $stateProvider.state('main.chartpurchases.priceyear', 
    {
          url: "/price-year",
          views: 
          {
              'po-price-year': 
              {
                  templateUrl: "apps/a_charts/views/purchases/price-year.html",
                  controller:'POPriceYearChartsCtrl'
              }
          },
    });
    $stateProvider.state('main.chartpurchases.stockyear', 
    {
          url: "/stock-year",
          views: 
          {
              'po-stock-year': 
              {
                  templateUrl: "apps/a_charts/views/purchases/stock-year.html",
                  controller:'POStockYearChartsCtrl'
              }
          },
    });

    $stateProvider.state('main.chartpurchases.stock', 
    {
          url: "/qty",
          views: 
          {
              'po-stock': 
              {
                  templateUrl: "apps/a_charts/views/purchases/stock.html",
                  controller:'POStockChartsCtrl'
              }
          },
    });

    $stateProvider.state('main.chartpurchases.price', 
    {
          url: "/harga",
          views: 
          {
              'po-price': 
              {
                  templateUrl: "apps/a_charts/views/purchases/price.html",
                  controller:'POPriceChartsCtrl'
              }
          },
    });


});