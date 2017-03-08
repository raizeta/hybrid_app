angular.module('starter')
.config(function ($stateProvider, $urlRouterProvider,$ionicConfigProvider,$httpProvider)
{
    $stateProvider.state('main.customers', 
    {
      url: '/customers',
      abstract: true,
      views: 
      {
          'charts-tab': 
          {
            templateUrl: 'apps/a_charts/views/customers/main.html',
          }
      }
    });
    $stateProvider.state('main.customers.newcustomers', 
    {
          url: "/newcustomers",
          views: 
          {
              'customers-newcustomers': 
              {
                  templateUrl: "apps/a_charts/views/customers/newcustomers.html",
                  controller:'CustNewChartsCtrl'
              }
          },
    });

    $stateProvider.state('main.customers.layergeo', 
    {
          url: "/layergeo",
          views: 
          {
              'customers-layergeo': 
              {
                  templateUrl: "apps/a_charts/views/customers/layergeo.html",
                  controller:'CustLayerGeoChartsCtrl'
              }
          },
    });

    $stateProvider.state('main.customers.kunjungan', 
    {
          url: "/kunjungan",
          views: 
          {
              'customers-kunjungan': 
              {
                  templateUrl: "apps/a_charts/views/customers/kunjungan.html",
                  controller:'CustKunjunganChartsCtrl'
              }
          },
    });

    $stateProvider.state('main.customers.stocklayergeo', 
    {
          url: "/stocklayergeo",
          views: 
          {
              'customers-stocklayergeo': 
              {
                  templateUrl: "apps/a_charts/views/customers/stocklayergeo.html",
                  controller:'CustStockLayerGeoChartsCtrl'
              }
          },
    });
    $stateProvider.state('main.customers.requestlayergeo', 
    {
          url: "/requestlayergeo",
          views: 
          {
              'customers-requestlayergeo': 
              {
                  templateUrl: "apps/a_charts/views/customers/requestlayergeo.html",
                  controller:'CustRequestLayerGeoChartsCtrl'
              }
          },
    });

    $stateProvider.state('main.customers.expiredlayergeo', 
    {
          url: "/expiredlayergeo",
          views: 
          {
              'customers-expiredlayergeo': 
              {
                  templateUrl: "apps/a_charts/views/customers/expiredlayergeo.html",
                  controller:'CustExpiredLayerGeoChartsCtrl'
              }
          },
    });
    $stateProvider.state('main.customers.expiredcomb', 
    {
          url: "/expiredcomb",
          views: 
          {
              'customers-expiredcomb': 
              {
                  templateUrl: "apps/a_charts/views/customers/expiredcomb.html",
                  controller:'CustExpiredCombChartsCtrl'
              }
          },
    });

    $stateProvider.state('main.customers.target', 
    {
          url: "/target",
          views: 
          {
              'customers-target': 
              {
                  templateUrl: "apps/a_charts/views/customers/target.html",
                  controller:'CustTargetChartsCtrl'
              }
          },
    });
});