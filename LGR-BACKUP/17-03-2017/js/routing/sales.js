angular.module('starter')
.config(function($stateProvider, $urlRouterProvider,$ionicConfigProvider) 
{
  $stateProvider.state('tab.sales', 
  {
      url: '/sales',
      views: 
      {
          'tab-sales': 
            {
              templateUrl: 'templates/sales/index.html',
              controller: 'SalesCtrl'
          }
      }
  });
  $stateProvider.state('tab.cashier', 
  {
      url: '/cashier',
      views: 
      {
          'tab-sales': 
            {
              templateUrl: 'templates/sales/cashier.html',
              controller: 'CashierCtrl'
          }
      }
  });
  $stateProvider.state('tab.cart', 
  {
      url: '/cart',
      views: 
      {
          'tab-sales': 
            {
              templateUrl: 'templates/sales/cart.html',
              controller: 'CartCtrl'
          }
      }
  })

});
