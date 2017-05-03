angular.module('starter')
.config(function($stateProvider, $urlRouterProvider,$ionicConfigProvider) 
{

  $stateProvider.state('tab.openbook', 
  {
      url: '/openbook',
      views: 
      {
          'view-content': 
            {
              templateUrl: 'templates/openclosebook/openbook.html',
              controller: 'OpenBookCtrl'
          }
      }
  });
  $stateProvider.state('tab.closebook', 
  {
      url: '/closebook',
      views: 
      {
        'view-content': 
        {
          templateUrl: 'templates/openclosebook/closebook.html',
          controller: 'CloseBookCtrl'
        }
      }
  });
  $stateProvider.state('tab.notifikasiclosebook', 
  {
      url: '/notifikasiclosebook',
      views: 
      {
        'view-content': 
        {
          templateUrl: 'templates/openclosebook/notifikasiclosebook.html',
          controller: 'NotifikasiCtrl'
        }
      }
  })


});
