angular.module('starter')
.config(function($stateProvider, $urlRouterProvider,$ionicConfigProvider) 
{
    $stateProvider.state('tab.settings', 
    {
        url: '/settings',
        views: 
        {
          'view-content': 
          {
            templateUrl: 'templates/settings/index.html',
            controller: 'SettingCtrl'
          }
        }
    });
});
