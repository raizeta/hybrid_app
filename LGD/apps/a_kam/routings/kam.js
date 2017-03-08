angular.module('starter')
.config(function ($stateProvider, $urlRouterProvider,$ionicConfigProvider,$httpProvider)
{
    $stateProvider.state('main.kam', 
    {
      url: '/kam',
      views: 
      {
          'ba-kam': 
          {
            templateUrl: 'apps/a_kam/views/index.html',
            controller:'KamVisitCtrl'
          }
      }
    })
    .state('main.kam-detail', 
    {
        url: '/kam/:detail',
        views: 
        {
          'ba-kam': 
          {
            templateUrl: 'apps/a_kam/views/visitdetail.html',
            controller: 'VisitDetailCtrl'
          }
        }
    });
});