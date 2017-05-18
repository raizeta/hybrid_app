angular.module('starter')
.config(function ($stateProvider, $urlRouterProvider,$ionicConfigProvider,$ionicConfigProvider) 
{
    $stateProvider.state('tab.setting', 
    {
        url: '/setting',
        views: 
        {
          'view-content': 
            {
              templateUrl: 'templates/setting/index.html',
              controller: 'SettingCtrl'
          }
        }
    });
});