angular.module('starter')
.config(function ($stateProvider, $urlRouterProvider,$ionicConfigProvider,$httpProvider)
{
    $stateProvider.state('main.charts', 
    {
      url: '/charts',
      views: 
      {
          'charts-tab': 
          {
            templateUrl: 'apps/a_charts/views/charts-dash.html',
            controller:'ChartsCtrl'
          }
      }
    });
});