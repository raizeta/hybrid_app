angular.module('starter')
.config(function ($stateProvider, $urlRouterProvider,$ionicConfigProvider,$ionicConfigProvider) 
{
    $stateProvider.state('tab.informasi', 
    {
        url: '/informasi',
        views: 
        {
          'view-content': 
            {
              templateUrl: 'templates/informasi/index.html'
          }
        }
    });
});