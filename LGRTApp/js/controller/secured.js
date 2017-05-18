angular.module('starter')
.controller('LoginCtrl', function($http,$timeout,$location,$scope,$ionicLoading,$state,$ionicHistory,$ionicPopup,auth,StorageService,SecuredFac) 
{

    // var lock = new Auth0Lock('tI8AC9Ykd1dSBKoKGETQeP8vAx86OQal', 'raizeta.auth0.com');
    // lock.show({connections: ['Username-Password-Authentication']});
    // lock.show({connections: ['twitter', 'facebook', 'linkedin']});
    // lock.show({connections: ['qraftlabs.com']});
    $scope.loginWithGoogle = function ()
    {
        $ionicLoading.show({
          template: 'Logging in...'
        });

        window.plugins.googleplus.login(
        {
        },
        function (user_data) 
        {
            var profile = {};
            profile.nickname    = user_data.email;
            profile.email       = user_data.email;
            profile.name        = user_data.displayName,
            profile.picture     = user_data.imageUrl;
            profile.identities  = [{'user_id':user_data.userId,'connection':'google-oauth2'}]; 
            StorageService.set('profile', profile);
            StorageService.set('token', profile.identities[0].user_id);
            $timeout(function()
            {
                $ionicLoading.hide();
                $ionicHistory.nextViewOptions({disableAnimate: true, disableBack: true});
                $location.path("/auth/register");
            });
        },
        function (msg) 
        {
            alert("error " + msg)
            // $ionicLoading.hide();
        });
    
    }
    
    $scope.loginWithFacebook = function ()
    {
        $ionicLoading.show
        ({
            template: 'Loading...'
        });
        auth.signin(
        {
            popup: true,
            connection: 'facebook',
            scope: 'openid name email' //Details: https:///scopes
        }, 
        function(profile, token) 
        {
            StorageService.set('profile', profile);
            StorageService.set('token', token);
            $timeout(function()
            {
                $ionicLoading.hide();
                $ionicHistory.nextViewOptions({disableAnimate: true, disableBack: true});
                $location.path("/auth/register");
            });  
        }, 
        function(error) 
        {
            $ionicLoading.hide();
            var alertPopup = $ionicPopup.alert
            ({
                title: 'Login failed!',
                template: 'Please check your credentials!'
            });
        });    
    }

    $scope.loginmanual  = function(users)
    {
        $ionicLoading.show();

        $scope.disableInput = true;
        $scope.users    = angular.copy(users);
        var username    = $scope.users.username;
        SecuredFac.GetProfileLogin(username, username)
        .then(function (result) 
        {
            if(!result.statusCode)
            {
                var profile = {};
                profile.nickname        = result[0].username;
                profile.email           = result[0].email;
                profile.ACCESS_UNIX     = result[0].ACCESS_UNIX;
                profile.name            = result[0].NAMA;
                StorageService.set('profile', profile);
                StorageService.set('token', result[0].access_token);
                $ionicHistory.nextViewOptions({disableAnimate: true, disableBack: true});
                $state.go('auth.register', {}, {reload: true});    
            }
            else
            {
                alert("Check Your Credentials");
            }   
        }, 
        function (err) 
        {          
            console.log(err);
        })
        .finally(function()
        {
           $ionicLoading.hide(); 
        });
    }
})
.controller('RegisterCtrl', function($timeout,$location,$http,$scope, $state, $ionicPopup,$ionicHistory,$ionicLoading,StorageService,SecuredFac) 
{
    var profile  = StorageService.get('profile');
    var username = profile.nickname;
    var email    = profile.email;
    SecuredFac.GetProfileLogin(username,email)
    .then(function(getprofilelogin)
    {
        if(angular.isArray(getprofilelogin))
        {
            profile.ACCESS_UNIX = getprofilelogin[0].ACCESS_UNIX;
            StorageService.set('profile',profile);
            $ionicHistory.nextViewOptions({disableAnimate: true, disableBack: true});
            $location.path("/tab/dashboard");
        }
    },
    function(errorgetprofilelogin)
    {
        console.log(errorgetprofilelogin);
    });

    $scope.customers = {'email':profile.email,'NAMA':profile.name}
    $scope.luasrumah = [{'nama':'100M-300M','type':'100-300'},{'nama':'500M-1000M','type':'500-1000'}];
    $scope.registerbaru = function (customers) 
    {
        $ionicLoading.show
        ({
          template: 'Loading...'
        })
        .then(function()
        {

            $scope.disableInput = true;
            var datatosave = {};
            datatosave.username     = profile.nickname;
            datatosave.email        = customers.email;
            datatosave.new_pass     = customers.new_pass;
            if(profile.identities[0].connection == 'facebook')
            {
                datatosave.ID_FB    = profile.identities[0].user_id;   
            }
            else if(profile.identities[0].connection == 'google-oauth2')
            {
                datatosave.ID_GOOGLE    = profile.identities[0].user_id;   
            }
            
            datatosave.NAMA         = customers.NAMA;
            datatosave.ALAMAT       = customers.ALAMAT;
            datatosave.HP           = customers.HP;
            datatosave.LUAS_TANAH   = customers.LUAS_TANAH.type;
            SecuredFac.SetProfileLogin(datatosave)
            .then(function(responsesetloginprofile)
            {
                profile.ACCESS_UNIX = responsesetloginprofile.ACCESS_UNIX;
                StorageService.set('profile',profile);
                $ionicHistory.nextViewOptions({disableAnimate: true, disableBack: true});
                $state.go('tab.dashboard',{},{reload:true});  
            },
            function(errorsetloginprofile)
            {
                console.log(errorsetloginprofile);
            })
            .finally(function()
            {
                $ionicLoading.hide();
            });
        });
    }
})