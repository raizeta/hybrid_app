angular.module('starter')
.config(function($stateProvider, $urlRouterProvider,$ionicConfigProvider) 
{
  // $stateProvider.state('tab.cashier', 
  // {
  //     url: '/cashier',
  //     views: 
  //     {
  //         'view-content': 
  //           {
  //             templateUrl: 'templates/sales/cashier.html',
  //             controller: 'CashierCtrl'
  //         }
  //     }
  // });
    
  $stateProvider.state('tab.sales', 
  {
      url: '/sales',
      views: 
      {
          'view-content': 
            {
              templateUrl: 'templates/sales/index.html',
              controller: 'SalesCtrl'
          }
      }
  });

  $stateProvider.state('tab.cart', 
  {
      url: '/cart',
      views: 
      {
          'view-content': 
            {
              templateUrl: 'templates/sales/cart.html',
              controller: 'CartCtrl'
          }
      }
  })

});
