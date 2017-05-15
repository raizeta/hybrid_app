angular.module('starter')
.config(function ($stateProvider, $urlRouterProvider,$ionicConfigProvider,$ionicConfigProvider,authProvider,$httpProvider) 
{
    authProvider.init({
        domain: 'raizeta.auth0.com',
        clientID: 'tI8AC9Ykd1dSBKoKGETQeP8vAx86OQal',
        callbackURL: location.href,
        loginState: 'auth.login'
      });

    $stateProvider.state('auth', 
    {
        url: '/auth',
        templateUrl: 'templates/secured/main.html',
        abstract:true,
        
    });
    $stateProvider.state('auth.login', 
    {
        url: '/login',
        views: 
        {
            'login-tab': 
            {
              templateUrl: 'templates/secured/login.html',
              controller: 'LoginCtrl',
            }
        },
        resolve:
        {
            userinformation: function ($q, StorageService,$injector,$location) 
            {
                var userinformation = StorageService.get('token');
                if(userinformation)
                {
                    $location.path("/auth/register");
                    console.log();
                }
            }  
        }

    });
    $stateProvider.state('auth.register', 
    {
        url: '/register',
        views: 
        {
            'login-tab': 
            {
              templateUrl: 'templates/secured/register.html',
              controller: 'RegisterCtrl',
            }
        }
    });

    $stateProvider.state('tab', 
    {
        url: '/tab',
        abstract: true,
        templateUrl: 'templates/tabs.html',
        controller: 'AppCtrl'
    });
    $stateProvider.state('tab.dashboard', 
    {
        url: '/dashboard',
        views: 
        {
          'view-content': 
            {
              templateUrl: 'templates/dashboard/index.html'
          }
        }
    });

    $urlRouterProvider.otherwise('/auth/login');
    $ionicConfigProvider.views.maxCache(0);
    $ionicConfigProvider.navBar.alignTitle('center');
});