angular.module('starter')
.config(function($stateProvider, $urlRouterProvider,$ionicConfigProvider) 
{
    $stateProvider.state('tab.accounting-summary', 
    {
          url: "/accounting-summary",
          views: 
          {
              'view-content': 
              {
                  templateUrl: "templates/accounting/summary.html",
                  controller:'SummaryCtrl'
              }
          },
    });

    $stateProvider.state('tab.accounting-transaksi', 
    {
          url: "/accounting-transaksi",
          views: 
          {
              'view-content': 
              {
                  templateUrl: "templates/accounting/transaksi.html",
                  controller:'TransaksiCtrl'
              }
          },
    });
    $stateProvider.state('tab.accounting-setoran', 
    {
          url: "/accounting-setoran",
          views: 
          {
              'view-content': 
              {
                  templateUrl: "templates/accounting/setoran.html",
                  controller:'SetoranCtrl'
              }
          },
    });
});
