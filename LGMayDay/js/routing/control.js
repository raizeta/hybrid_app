angular.module('starter')
.config(function($stateProvider, $urlRouterProvider,$ionicConfigProvider) 
{

  $stateProvider.state('tab.newstores', 
  {
      url: '/control/stores',
      views: 
      {
          'view-content': 
            {
              templateUrl: 'templates/control/stores.html',
              controller: 'ControlStoresCtrl'
          }
      }
  });
  $stateProvider.state('tab.newemploye', 
  {
      url: '/control/employe',
      views: 
      {
          'view-content': 
            {
              templateUrl: 'templates/control/employe.html',
              controller: 'EmployeCtrl'
          }
      }
  });
  $stateProvider.state('tab.newproduct', 
  {
      url: '/control/product',
      views: 
      {
          'view-content': 
            {
              templateUrl: 'templates/control/product.html',
              controller: 'AbsensiCtrl'
          }
      }
  });
  $stateProvider.state('tab.newmerchant', 
  {
      url: '/control/merchant',
      views: 
      {
          'view-content': 
            {
              templateUrl: 'templates/control/merchant.html',
              controller: 'AbsensiCtrl'
          }
      }
  });
});
