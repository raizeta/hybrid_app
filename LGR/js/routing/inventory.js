angular.module('starter')
.config(function($stateProvider, $urlRouterProvider,$ionicConfigProvider) 
{
  $stateProvider.state('tab.checkstore', 
    {
          url: '/checkstore',
          abstract: true,
          views: 
          {
            'tab-checkstore': 
            {
              templateUrl: 'templates/checkstore/index.html'
            }
          }
    });
    $stateProvider.state('tab.checkstore.inventory', 
    {
          url: "/inventory",
          views: 
          {
              'checkstore-inventory': 
              {
                  templateUrl: "templates/checkstore/inventory.html",
                  controller:'InventoryCtrl'
              }
          },
    });
    $stateProvider.state('tab.checkstore.booking', 
    {
          url: "/booking",
          views: 
          {
              'checkstore-booking': 
              {
                  templateUrl: "templates/checkstore/booking.html",
                  controller:'BookingCtrl'
              }
          },
    });

    $stateProvider.state('tab.checkstore.sync', 
    {
          url: "/sync",
          views: 
          {
              'checkstore-sync': 
              {
                  templateUrl: "templates/checkstore/sync.html",
                  controller:'SyncCtrl'
              }
          },
    });

});
