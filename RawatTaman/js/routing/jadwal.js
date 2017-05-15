angular.module('starter')
.config(function ($stateProvider, $urlRouterProvider,$ionicConfigProvider,$ionicConfigProvider) 
{
    $stateProvider.state('tab.jadwal', 
    {
        url: '/jadwal',
        views: 
        {
          'view-content': 
            {
              templateUrl: 'templates/jadwal/index.html',
              controller: 'JadwalCtrl'
          }
        }
    });
    $stateProvider.state('tab.jadwal-detail', 
    {
        url: '/jadwal/:detail',
        views: 
        {
          'view-content': 
            {
              templateUrl: 'templates/jadwal/detail.html',
              controller: 'JadwalDetailCtrl'
          }
        }
    });
});