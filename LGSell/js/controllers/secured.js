angular.module('starter')
.controller('LoginCtrl', function($scope, $state, $ionicPopup,$ionicLoading,SecuredFac,StoreFac,StorageService) 
{
    StoreFac.GetPureStores()
    .then(function(response)
    {
        $scope.datastore = response;
    },
    function(error)
    {
        console.log(error)
    })
    .finally(function()
    {
        console.log("Sukses");
    });

    $scope.login = function (user) 
    {
        $ionicLoading.show
        ({
            template: 'Loading...'
        });

        

        $scope.disableInput = true;
        $scope.users    = angular.copy(user);
        var username    = $scope.users.username;
        var password    = $scope.users.password;
        var lokasistore = $scope.users.lokasistore
            

        SecuredFac.Login(username, password)
        .then(function (result) 
        {
            if(result == 'username_salah')
            {
                var alertPopup = $ionicPopup.alert({
                  title: 'Login failed!',
                  template: 'Username Salah!'
                });
                alertPopup.then(function(res) 
                {
                    if(res)
                    {
                       user.username = null;
                       user.password = null;
                       focus('focusUsername'); 
                    }
                    
                });

            }
            else
            {
                StorageService.set('LokasiStore',lokasistore);
                $state.go('tab.cashier', {}, {reload: true});
            }   
        }, 
        function (err) 
        {          
            if(err == 'password_salah')
            {
                user.password = null;
                focus('focusPassword');
                var alertPopup = $ionicPopup.alert({
                  title: 'Login failed!',
                  template: 'Password Salah!'
                });
                 
            }
            else if(err == 'username_salah')
            {
                var alertPopup = $ionicPopup.alert({
                  title: 'Login failed!',
                  template: 'Username Salah!'
                });
                user.username = null;
                user.password = null;
                focus('focusUsername');
            }
            else
            {
                var alertPopup = $ionicPopup.alert({
                  title: 'Login failed!',
                  template: 'Jaringan Bermasalah!'
                });
                focus('focusUsername');
            }
        })
        .finally(function()
        {
           $ionicLoading.hide(); 
        });
    }
})

.controller('AccountCtrl', function($window,$scope,$state,$location,$timeout,$ionicLoading,$ionicHistory,StorageService) 
{
    $scope.profile  = StorageService.get('profile');
    $scope.logout = function() 
    {
      StorageService.destroy('profile');
      $location.path('auth/login');
      $timeout(function () 
      {
            $ionicLoading.hide();
            $ionicHistory.clearCache();
            $ionicHistory.clearHistory();
            $ionicHistory.nextViewOptions({ disableBack: true, historyRoot: true });
            $window.location.href = "index.html";
        }, 30);
    };
    
});