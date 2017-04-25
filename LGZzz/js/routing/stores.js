angular.module('starter')
.config(function($stateProvider, $urlRouterProvider,$ionicConfigProvider) 
{

  $stateProvider.state('tab.stores', 
  {
      url: '/stores',
      views: 
      {
          'view-content': 
            {
              templateUrl: 'templates/stores/index.html',
              controller: 'StoresCtrl'
          }
      }
  });


});
