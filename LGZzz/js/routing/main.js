angular.module('starter')
.config(function($stateProvider, $urlRouterProvider,$ionicConfigProvider) 
{

  $stateProvider.state('tab', 
  {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html',
    controller: 'AppCtrl',
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
  })

  .state('tab.account', 
  {
      url: '/account',
      views: 
      {
        'view-content': 
        {
          templateUrl: 'templates/secured/tab-account.html',
          controller: 'AccountCtrl'
        }
      }
  })

  $urlRouterProvider.otherwise('/init/stores');
  $ionicConfigProvider.tabs.position('bottom');
  $ionicConfigProvider.navBar.alignTitle('center');
  $ionicConfigProvider.views.maxCache(0);

});
