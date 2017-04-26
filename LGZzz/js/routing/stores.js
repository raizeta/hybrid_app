angular.module('starter')
.config(function($stateProvider, $urlRouterProvider,$ionicConfigProvider) 
{

  // $stateProvider.state('tab.stores', 
  // {
  //     url: '/stores',
  //     views: 
  //     {
  //         'view-content': 
  //           {
  //             templateUrl: 'templates/stores/index.html',
  //             controller: 'StoresCtrl'
  //         }
  //     }
  // });
  $stateProvider.state('init', 
  {
      url: '/init',
      templateUrl: 'templates/stores/mainstores.html',
      abstract:true,
      resolve:
      {
          auth: function ($q, SecuredFac,$injector,$location) 
          {
              var userInfo = SecuredFac.getUserInfo();
              if(userInfo)
              {
                  return $q.when(userInfo);
              }
              else 
              {
                  $location.path("/auth/login");
                  console.log();
              }
          }  
      }
  });
  $stateProvider.state('init.stores', 
  {
      url: '/stores',
      views: 
      {
          'stores-tab': 
          {
            templateUrl: 'templates/stores/index.html',
            controller: 'StoresCtrl',
          }
      }
  });


});
