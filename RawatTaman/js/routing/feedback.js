angular.module('starter')
.config(function ($stateProvider, $urlRouterProvider,$ionicConfigProvider,$ionicConfigProvider) 
{
    $stateProvider.state('tab.feedback', 
    {
        url: '/feedback',
        views: 
        {
          'view-content': 
            {
              templateUrl: 'templates/feedback/index.html'
          }
        }
    });
});