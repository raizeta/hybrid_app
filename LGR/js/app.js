angular.module('starter', ['ionic','ngCordova'])
.run(function($ionicPlatform,$rootScope,$cordovaSQLite) 
{
    $ionicPlatform.ready(function() 
    {
        $rootScope.db = window.sqlitePlugin.openDatabase({name:"rasasayang.db", location:'default', androidLockWorkaround: 1, androidDatabaseImplementation: 2});
        $cordovaSQLite.execute($rootScope.db, 'CREATE TABLE IF NOT EXISTS Tbl_Store (id INTEGER PRIMARY KEY AUTOINCREMENT,OUTLET_BARCODE TEXT,OUTLET_NM TEXT,LOCATE INTEGER,LOCATE_NAME TEXT,LOCATE_SUB INTEGER,LOCATE_SUB_NAME TEXT,ALAMAT TEXT,PIC TEXT,TLP TEXT,STATUS INTEGER,CREATE_BY TEXT,UPDATE_BY TEXT,CREATE_AT TEXT,UPDATE_AT TEXT)');
        $cordovaSQLite.execute($rootScope.db, 'CREATE TABLE IF NOT EXISTS Tbl_Product (id INTEGER PRIMARY KEY AUTOINCREMENT,ITEM_ID TEXT,ITEM_NM TEXT,STATUS INTEGER,CREATE_BY TEXT,UPDATE_BY TEXT,CREATE_AT TEXT,UPDATE_AT TEXT,IMG64 TEXT)');
        $cordovaSQLite.execute($rootScope.db, 'CREATE TABLE IF NOT EXISTS Tbl_ItemGroup (id INTEGER PRIMARY KEY AUTOINCREMENT,OUTLET_ID,StoreNm TEXT,LocateNm TEXT,LocatesubNm TEXT,ITEM_BARCODE TEXT,ItemNm TEXT,GRP_DISPLAY TEXT,HPP TEXT,PERSEN_MARGIN TEXT,STATUS INTEGER,CREATE_AT TEXT,UPDATE_AT TEXT,CREATE_BY TEXT,UPDATE_BY TEXT,FORMULA_ID TEXT,FORMULA)');
        $cordovaSQLite.execute($rootScope.db, 'CREATE TABLE IF NOT EXISTS Tbl_CustBuyTrans (id INTEGER PRIMARY KEY AUTOINCREMENT,TGL_TRANS TEXT,DATETIME_TRANS TEXT,NOMOR_TRANS TEXT,STATUS_BUY TEXT)');
        $cordovaSQLite.execute($rootScope.db, 'CREATE TABLE IF NOT EXISTS Tbl_CustBuyDetail (id INTEGER PRIMARY KEY AUTOINCREMENT,TGL_BUYTRANS TEXT,DATETIME_BUYTRANS TEXT,NOMOR_TRANS TEXT,ITEM_ID TEXT,ITEM_NAMA TEXT,HARGA_ITEM TEXT,QTY_BUY INTEGER,DISCOUNT_ITEM TEXT)');
        $cordovaSQLite.execute($rootScope.db, 'CREATE TABLE IF NOT EXISTS Tbl_InvCheck (id INTEGER PRIMARY KEY AUTOINCREMENT,TGL_CHECK TEXT,DATETIME_CHECK TEXT,NAMA_INV TEXT,STATUS_CHECK TEXT)');
        $cordovaSQLite.execute($rootScope.db, 'CREATE TABLE IF NOT EXISTS Tbl_BarangPenjualan (id INTEGER PRIMARY KEY AUTOINCREMENT,TGL_SAVE TEXT,ITEM_ID TEXT,ITEM_NM TEXT,ITEM_HARGA INTEGER,STOCK_MAX INTEGER,GAMBAR TEXT,FORMULA TEXT)');
        $cordovaSQLite.execute($rootScope.db, 'CREATE TABLE IF NOT EXISTS Tbl_ShopCart (id INTEGER PRIMARY KEY AUTOINCREMENT,TGL_ADDTOCART TEXT,DATETIME_ADDTOCART TEXT,NOMOR_TRANS TEXT,ITEM_ID TEXT,ITEM_NM TEXT,ITEM_HARGA INTEGER,QTY_INCART INTEGER,DISCOUNT TEXT)');
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
    });
    $rootScope.db = window.openDatabase("rasasayang.db", "1.0", "Your App", 200000);
    $cordovaSQLite.execute($rootScope.db, 'CREATE TABLE IF NOT EXISTS Tbl_Store (id INTEGER PRIMARY KEY AUTOINCREMENT,OUTLET_BARCODE TEXT,OUTLET_NM TEXT,LOCATE INTEGER,LOCATE_NAME TEXT,LOCATE_SUB INTEGER,LOCATE_SUB_NAME TEXT,ALAMAT TEXT,PIC TEXT,TLP TEXT,STATUS INTEGER,CREATE_BY TEXT,UPDATE_BY TEXT,CREATE_AT TEXT,UPDATE_AT TEXT)');
    $cordovaSQLite.execute($rootScope.db, 'CREATE TABLE IF NOT EXISTS Tbl_Product (id INTEGER PRIMARY KEY AUTOINCREMENT,ITEM_ID TEXT,ITEM_NM TEXT,STATUS INTEGER,CREATE_BY TEXT,UPDATE_BY TEXT,CREATE_AT TEXT,UPDATE_AT TEXT,IMG64 TEXT)');
    $cordovaSQLite.execute($rootScope.db, 'CREATE TABLE IF NOT EXISTS Tbl_ItemGroup (id INTEGER PRIMARY KEY AUTOINCREMENT,OUTLET_ID,StoreNm TEXT,LocateNm TEXT,LocatesubNm TEXT,ITEM_BARCODE TEXT,ItemNm TEXT,GRP_DISPLAY TEXT,HPP TEXT,PERSEN_MARGIN TEXT,STATUS INTEGER,CREATE_AT TEXT,UPDATE_AT TEXT,CREATE_BY TEXT,UPDATE_BY TEXT,FORMULA_ID TEXT,FORMULA)');
    $cordovaSQLite.execute($rootScope.db, 'CREATE TABLE IF NOT EXISTS Tbl_CustBuyTrans (id INTEGER PRIMARY KEY AUTOINCREMENT,TGL_TRANS TEXT,DATETIME_TRANS TEXT,NOMOR_TRANS TEXT,STATUS_BUY TEXT)');
    $cordovaSQLite.execute($rootScope.db, 'CREATE TABLE IF NOT EXISTS Tbl_CustBuyDetail (id INTEGER PRIMARY KEY AUTOINCREMENT,TGL_BUYTRANS TEXT,DATETIME_BUYTRANS TEXT,NOMOR_TRANS TEXT,ITEM_ID TEXT,ITEM_NAMA TEXT,HARGA_ITEM TEXT,QTY_BUY INTEGER,DISCOUNT_ITEM TEXT)');
    $cordovaSQLite.execute($rootScope.db, 'CREATE TABLE IF NOT EXISTS Tbl_InvCheck (id INTEGER PRIMARY KEY AUTOINCREMENT,TGL_CHECK TEXT,DATETIME_CHECK TEXT,NAMA_INV TEXT,STATUS_CHECK TEXT)');
    $cordovaSQLite.execute($rootScope.db, 'CREATE TABLE IF NOT EXISTS Tbl_BarangPenjualan (id INTEGER PRIMARY KEY AUTOINCREMENT,TGL_SAVE TEXT,ITEM_ID TEXT,ITEM_NM TEXT,ITEM_HARGA INTEGER,STOCK_MAX INTEGER,GAMBAR TEXT,FORMULA TEXT)');
    $cordovaSQLite.execute($rootScope.db, 'CREATE TABLE IF NOT EXISTS Tbl_ShopCart (id INTEGER PRIMARY KEY AUTOINCREMENT,TGL_ADDTOCART TEXT,DATETIME_ADDTOCART TEXT,NOMOR_TRANS TEXT,ITEM_ID TEXT,ITEM_NM TEXT,ITEM_HARGA INTEGER,QTY_INCART INTEGER,DISCOUNT TEXT)');
    
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
