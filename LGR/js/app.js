angular.module('starter', ['ngCordova','ionic'])
.run(function($ionicPlatform,$rootScope,$filter,$cordovaSQLite) 
{
    $ionicPlatform.ready(function() 
    {
        if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) 
        {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            cordova.plugins.Keyboard.disableScroll(true);
        }
        if (window.StatusBar) 
        {
            // StatusBar.styleDefault();
            return StatusBar.hide();
        }

        var notificationOpenedCallback = function(jsonData) 
        {
          console.log('notificationOpenedCallback: ' + JSON.stringify(jsonData));
        };

        window.plugins.OneSignal.startInit("a291df49-653d-41ff-858d-e36513440760", "943983549601")
                      .handleNotificationOpened(notificationOpenedCallback)
                      .endInit();

        $rootScope.db = window.sqlitePlugin.openDatabase({name:"rasasayang.db", location:'default', androidLockWorkaround: 1, androidDatabaseImplementation: 2});
        $cordovaSQLite.execute($rootScope.db, 'CREATE TABLE IF NOT EXISTS Tbl_Inv_Shop (id INTEGER PRIMARY KEY AUTOINCREMENT,tanggal_transaksi TEXT,nama_product TEXT,qty_arrived INTEGER,qty_booking INTEGER,qty_checking INTEGER,qty_forsale INTEGER,status_check INTEGER)');
    });

    $rootScope.getCameraOptions = function()
    {
        
        var options = {
                quality: 50,
                destinationType: Camera.DestinationType.DATA_URL,
                sourceType: Camera.PictureSourceType.CAMERA,
                allowEdit: false,
                encodingType: Camera.EncodingType.JPEG,
                targetWidth: 500,
                targetHeight: 500,
                popoverOptions: CameraPopoverOptions,
                saveToPhotoAlbum: false,
                correctOrientation:true
              };
        return options;
    }
})

.controller('AppCtrl', function($rootScope,$scope, $state,StorageService) 
{
  var profile = StorageService.get('profile');
  $scope.profile = profile;
  $scope.logout = function() 
  {
      StorageService.destroy('profile');
      $state.go('auth.login',{},{reload: true});
  };
});
