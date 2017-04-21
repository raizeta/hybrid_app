angular.module('starter')
.config(function($stateProvider, $urlRouterProvider,$ionicConfigProvider) 
{

    $stateProvider.state('tab.checkstore-inventory', 
    {
          url: "/checkstore-inventory",
          views: 
          {
              'view-content': 
              {
                  templateUrl: "templates/checkstore/inventory.html",
                  controller:'InventoryCtrl'
              }
          },
    });
    $stateProvider.state('tab.checkstore-booking', 
    {
          url: "/checkstore-booking",
          views: 
          {
              'view-content': 
              {
                  templateUrl: "templates/checkstore/booking.html",
                  controller:'BookingCtrl'
              }
          },
    });

    $stateProvider.state('tab.checkstore-sync', 
    {
          url: "/checkstore-sync",
          views: 
          {
              'view-content': 
              {
                  templateUrl: "templates/checkstore/sync.html",
                  controller:'SyncCtrl'
              }
          },
    });

});
