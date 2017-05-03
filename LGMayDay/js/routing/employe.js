angular.module('starter')
.config(function($stateProvider, $urlRouterProvider,$ionicConfigProvider) 
{

  $stateProvider.state('tab.employe', 
  {
      url: '/employe',
      views: 
      {
          'view-content': 
            {
              templateUrl: 'templates/employe/index.html',
              controller: 'EmployeCtrl'
          }
      }
  });
  $stateProvider.state('tab.absensi', 
  {
      url: '/absensi',
      views: 
      {
          'view-content': 
            {
              templateUrl: 'templates/employe/absensi.html',
              controller: 'AbsensiCtrl'
          }
      }
  });
});
