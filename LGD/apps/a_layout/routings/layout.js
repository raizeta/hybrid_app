angular.module('starter')
.config(function ($stateProvider, $urlRouterProvider,$ionicConfigProvider,$ionicConfigProvider) 
{
  $ionicConfigProvider.views.maxCache(60);
  $stateProvider
  .state('main', 
  {
    url: '/main',
    abstract: true,
    templateUrl: 'apps/a_layout/views/main.html',
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
  .state('main.dashboard', 
  {
    url: '/dashboard',
    views: 
    {
        'dashboard-tab': 
        {
          templateUrl: 'apps/a_layout/views/dashboard.html',
          controller: 'DashboardCtrl'
        }
    }
  })

  $urlRouterProvider.otherwise(function ($injector, $location) 
  {
    var $state = $injector.get("$state");
    $state.go("main.dashboard");
  });

  $ionicConfigProvider.tabs.position('bottom');
  $ionicConfigProvider.navBar.alignTitle('center');
});