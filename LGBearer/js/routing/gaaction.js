angular.module('starter')
.config(function($stateProvider, $urlRouterProvider,$ionicConfigProvider) 
{
    $stateProvider.state('tab.ho-inventory', 
    {
          url: "/ho-inventory",
          views: 
          {
              'view-content': 
              {
                  templateUrl: "templates/ga-action/inventory.html",
                  controller:'GaInventoryCtrl'
              }
          },
    });

});
