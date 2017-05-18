angular.module('starter')
.config(function ($stateProvider, $urlRouterProvider,$ionicConfigProvider,$ionicConfigProvider) 
{
    $stateProvider.state('tab.history', 
    {
        url: '/history',
        views: 
        {
          'view-content': 
            {
              templateUrl: 'templates/history/index.html',
              controller: 'HistoryCtrl'
          }
        }
    });
    $stateProvider.state('tab.history-detail', 
    {
        url: '/history/:detail',
        views: 
        {
          'view-content': 
            {
              templateUrl: 'templates/history/detail.html',
              controller: 'HistoryDetailCtrl'
          }
        }
    });
});