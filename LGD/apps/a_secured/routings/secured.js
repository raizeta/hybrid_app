angular.module('starter')
.config(function ($stateProvider, $urlRouterProvider,$ionicConfigProvider,$ionicConfigProvider) 
{

    $stateProvider.state('auth', 
    {
      url: '/auth',
      templateUrl: 'apps/a_secured/views/mainlogin.html',
      abstract:true,
      
    });
    $stateProvider.state('auth.login', 
    {
      url: '/login',
      views: 
      {
          'login-tab': 
          {
            templateUrl: 'apps/a_secured/views/login.html',
            controller: 'LoginCtrl',
          }
      },
      resolve:
      {
          auth: function ($q,SecuredFac,$location) 
          {
              var userInfo=SecuredFac.getUserInfo();
              if(userInfo)
              {
                  $location.path("/main/dashboard");
                  $apply();
              }
          }
      }
    });
    $stateProvider.state('auth.register', 
    {
      url: '/register',
      views: 
      {
          'register-tab': 
          {
            templateUrl: 'apps/a_secured/views/register.html',
          }
      }
    });
});