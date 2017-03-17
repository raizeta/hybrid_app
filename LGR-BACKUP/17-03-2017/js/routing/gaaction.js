angular.module('starter')
.config(function($stateProvider, $urlRouterProvider,$ionicConfigProvider) 
{
  $stateProvider.state('tab.ga-action', 
    {
          url: '/ga-action',
          abstract: true,
          views: 
          {
            'tab-ga-action': 
            {
              templateUrl: 'templates/ga-action/index.html'
            }
          }
    });
    $stateProvider.state('tab.ga-action.inventory', 
    {
          url: "/inventory",
          views: 
          {
              'ga-action-inventory': 
              {
                  templateUrl: "templates/ga-action/inventory.html",
                  controller:'GaInventoryCtrl'
              }
          },
    });

});
