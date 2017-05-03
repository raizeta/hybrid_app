angular.module('starter', ['ionic','ngCordova','ui.grid', 'ui.grid.selection','ds.clock'])
.run(function($ionicPlatform,$rootScope,$cordovaSQLite) 
{
    $ionicPlatform.ready(function() 
    {
        // $rootScope.db = window.sqlitePlugin.openDatabase({name:"rasasayang.db", location:'default', androidLockWorkaround: 1, androidDatabaseImplementation: 2});
        // $cordovaSQLite.execute($rootScope.db, 'CREATE TABLE IF NOT EXISTS Tbl_Store (id INTEGER PRIMARY KEY AUTOINCREMENT,OUTLET_BARCODE TEXT,OUTLET_NM TEXT,LOCATE INTEGER,LOCATE_NAME TEXT,LOCATE_SUB INTEGER,LOCATE_SUB_NAME TEXT,ALAMAT TEXT,PIC TEXT,TLP TEXT,STATUS INTEGER,CREATE_BY TEXT,UPDATE_BY TEXT,CREATE_AT TEXT,UPDATE_AT TEXT)');
        // $cordovaSQLite.execute($rootScope.db, 'CREATE TABLE IF NOT EXISTS Tbl_Product (id INTEGER PRIMARY KEY AUTOINCREMENT,ITEM_ID TEXT,ITEM_NM TEXT,STATUS INTEGER,CREATE_BY TEXT,UPDATE_BY TEXT,CREATE_AT TEXT,UPDATE_AT TEXT,IMG64 TEXT)');
        // $cordovaSQLite.execute($rootScope.db, 'CREATE TABLE IF NOT EXISTS Tbl_ItemGroup (id INTEGER PRIMARY KEY AUTOINCREMENT,OUTLET_ID,StoreNm TEXT,LocateNm TEXT,LocatesubNm TEXT,ITEM_BARCODE TEXT,ItemNm TEXT,GRP_DISPLAY TEXT,HPP TEXT,PERSEN_MARGIN TEXT,STATUS INTEGER,CREATE_AT TEXT,UPDATE_AT TEXT,CREATE_BY TEXT,UPDATE_BY TEXT,FORMULA_ID TEXT,FORMULA)');
        // $cordovaSQLite.execute($rootScope.db, 'CREATE TABLE IF NOT EXISTS Tbl_CustBuyTrans (id INTEGER PRIMARY KEY AUTOINCREMENT,TGL_TRANS TEXT,DATETIME_TRANS TEXT,NOMOR_TRANS TEXT,STATUS_BUY TEXT)');
        // $cordovaSQLite.execute($rootScope.db, 'CREATE TABLE IF NOT EXISTS Tbl_CustBuyDetail (id INTEGER PRIMARY KEY AUTOINCREMENT,TGL_BUYTRANS TEXT,DATETIME_BUYTRANS TEXT,NOMOR_TRANS TEXT,ITEM_ID TEXT,ITEM_NAMA TEXT,HARGA_ITEM TEXT,QTY_BUY INTEGER,DISCOUNT_ITEM TEXT)');
        // $cordovaSQLite.execute($rootScope.db, 'CREATE TABLE IF NOT EXISTS Tbl_InvCheck (id INTEGER PRIMARY KEY AUTOINCREMENT,TGL_CHECK TEXT,DATETIME_CHECK TEXT,NAMA_INV TEXT,STATUS_CHECK TEXT)');
        // $cordovaSQLite.execute($rootScope.db, 'CREATE TABLE IF NOT EXISTS Tbl_BarangPenjualan (id INTEGER PRIMARY KEY AUTOINCREMENT,TGL_SAVE TEXT,ITEM_ID TEXT,ITEM_NM TEXT,ITEM_HARGA INTEGER,STOCK_MAX INTEGER,GAMBAR TEXT,FORMULA TEXT)');
        // $cordovaSQLite.execute($rootScope.db, 'CREATE TABLE IF NOT EXISTS Tbl_ShopCart (id INTEGER PRIMARY KEY AUTOINCREMENT,TGL_ADDTOCART TEXT,DATETIME_ADDTOCART TEXT,NOMOR_TRANS TEXT,ITEM_ID TEXT,ITEM_NM TEXT,ITEM_HARGA INTEGER,QTY_INCART INTEGER,DISCOUNT TEXT)');
        // $cordovaSQLite.execute($rootScope.db, 'CREATE TABLE IF NOT EXISTS Tbl_SaveBill (id INTEGER PRIMARY KEY AUTOINCREMENT,TGL_SAVE TEXT,NOMOR_TRANS TEXT,ALIAS_TRANS TEXT)');
        if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) 
        {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            cordova.plugins.Keyboard.disableScroll(false);
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
    $cordovaSQLite.execute($rootScope.db, 'CREATE TABLE IF NOT EXISTS Tbl_Store (id INTEGER PRIMARY KEY AUTOINCREMENT,ACCESS_UNIX TEXT,OUTLET_CODE TEXT,OUTLET_NM TEXT,LOCATE_PROVINCE TEXT,LOCATE_CITY TEXT,ALAMAT TEXT,PIC TEXT,TLP TEXT,FAX TEXT,EXPIRED TEXT,STATUS INTEGER,CREATE_BY TEXT,UPDATE_BY TEXT,CREATE_AT TEXT,UPDATE_AT TEXT,IS_ONSERVER INTEGER)');
    $cordovaSQLite.execute($rootScope.db, 'CREATE TABLE IF NOT EXISTS Tbl_BarangPenjualan (id INTEGER PRIMARY KEY AUTOINCREMENT,TGL_SAVE TEXT,OUTLET_CODE TEXT,ITEM_ID TEXT,ITEM_NM TEXT,SATUAN TEXT,DEFAULT_HARGA INTEGER,DEFAULT_STOCK INTEGER,DEFAULT_DISCOUNT TEXT,DEFAULT_IMAGE TEXT,UPDATE_AT TEXT,STATUS INT,IS_ONSERVER INT)');
    $cordovaSQLite.execute($rootScope.db, 'CREATE TABLE IF NOT EXISTS Tbl_CustBuyTrans (id INTEGER PRIMARY KEY AUTOINCREMENT,ID_SERVER INT,TRANS_DATE TEXT,TRANS_ID TEXT,ACCESS_UNIX TEXT,OUTLET_ID TEXT,TOTAL_ITEM INTEGER,TOTAL_HARGA INTEGER,TYPE_PAY INTEGER,BANK_NM TEXT,BANK_NO TEXT,CONSUMER_NM TEXT,CONSUMER_EMAIL TEXT,CONSUMER_PHONE TEXT,CREATE_BY TEXT,CREATE_AT TEXT,UPDATE_BY TEXT,UPDATE_AT TEXT,STATUS INT,STATUS_BUY TEXT,IS_ONSERVER INT)');
    
    $cordovaSQLite.execute($rootScope.db, 'CREATE TABLE IF NOT EXISTS Tbl_CloseBook (id INTEGER PRIMARY KEY AUTOINCREMENT,TGL_CLOSE TEXT,ACCESS_UNIX TEXT,OUTLET_CODE TEXT,CASHINDRAWER INT,CHECKCASH INT,ADDCASH INT,SELLCASH INT,TOTALCASH INT,WITHDRAW INT,IS_OPEN INTEGER,IS_CLOSE INTEGER,IS_ONSERVER INT)');
    

    $cordovaSQLite.execute($rootScope.db, 'CREATE TABLE IF NOT EXISTS Tbl_ShopCart (id INTEGER PRIMARY KEY AUTOINCREMENT,TGL_ADDTOCART TEXT,DATETIME_ADDTOCART TEXT,NOMOR_TRANS TEXT,ITEM_ID TEXT,ITEM_NM TEXT,ITEM_HARGA INTEGER,QTY_INCART INTEGER,DISCOUNT TEXT,IS_ONSERVER INT)');
    $cordovaSQLite.execute($rootScope.db, 'CREATE TABLE IF NOT EXISTS Tbl_SaveBill (id INTEGER PRIMARY KEY AUTOINCREMENT,TGL_SAVE TEXT,NOMOR_TRANS TEXT,ALIAS_TRANS TEXT)');
    $cordovaSQLite.execute($rootScope.db, 'CREATE TABLE IF NOT EXISTS Tbl_Customer (id INTEGER PRIMARY KEY AUTOINCREMENT,TGL_SAVE TEXT,ACCESS_UNIX TEXT,OUTLET_CODE TEXT,NAME TEXT,EMAIL TEXT,PHONE TEXT,CREATE_AT TEXT,UPDATE_AT TEXT,IS_ONSERVER INT)');
    $cordovaSQLite.execute($rootScope.db, 'CREATE TABLE IF NOT EXISTS Tbl_Harga (id INTEGER PRIMARY KEY AUTOINCREMENT,ITEM_ID TEXT,OUTLET_CODE TEXT,ITEM_HARGA INTEGER,PERIODE_TGL1 TEXT,PERIODE_TGL2 TEXT,START_TIME TEXT,DCRIPT TEXT)');
    $cordovaSQLite.execute($rootScope.db, 'CREATE TABLE IF NOT EXISTS Tbl_Diskon (id INTEGER PRIMARY KEY AUTOINCREMENT,ITEM_ID TEXT,OUTLET_CODE TEXT,DISCOUNT_PERCENT TEXT,MAX_DISCOUNT TEXT,PERIODE_TGL1 TEXT,PERIODE_TGL2 TEXT,PERIODE_TIME1 TEXT,PERIODE_TIME2 TEXT,STATUS INT,DCRIPT TEXT)');
    $cordovaSQLite.execute($rootScope.db, 'CREATE TABLE IF NOT EXISTS Tbl_Absensi (id INTEGER PRIMARY KEY AUTOINCREMENT,TGL_SAVE TEXT,WAKTU_ABSENSI TEXT,TYPE_ABSENSI TEXT,OUTLET_CODE TEXT,EMP_ID TEXT,USERNAME TEXT,ACCESS_UNIX TEXT,IMG_ABSENSI TEXT,LAT_POST TEXT,LNG_POST TEXT,IS_ONSERVER INT)');
    $cordovaSQLite.execute($rootScope.db, 'CREATE TABLE IF NOT EXISTS Tbl_StoreCheck (id INTEGER PRIMARY KEY AUTOINCREMENT,TGL_SAVE TEXT,OUTLET_CODE TEXT,USERNAME TEXT,ACCESS_UNIX TEXT,STATUS_CHECK INT)');
    $cordovaSQLite.execute($rootScope.db, 'CREATE TABLE IF NOT EXISTS Tbl_Merchant (id INTEGER PRIMARY KEY AUTOINCREMENT,TGL_SAVE TEXT,OUTLET_CODE TEXT,MERCHANT_NO TEXT,MERCHANT_NM TEXT,MERCHANT_OWNER TEXT,STATUS_DISPLAY INT,IS_ONSERVER INT)');
    $cordovaSQLite.execute($rootScope.db, 'CREATE TABLE IF NOT EXISTS Tbl_Employe (id INTEGER PRIMARY KEY AUTOINCREMENT,ACCESS_UNIX TEXT,OUTLET_CODE TEXT,EMP_ID TEXT,NAME TEXT,EMP_KTP TEXT,EMP_ALAMAT TEXT,EMP_GENDER TEXT,EMP_STS_NIKAH TEXT,EMP_TLP TEXT,EMP_HP TEXT,EMP_EMAIL TEXT,IS_ONSERVER INT)');
    
    $cordovaSQLite.execute($rootScope.db, 'CREATE TABLE IF NOT EXISTS Tbl_Setoran (id INTEGER PRIMARY KEY AUTOINCREMENT,CLOSING_ID TEXT,ACCESS_UNIX TEXT,STORAN_DATE TEXT,OUTLET_CODE TEXT,TTL_STORAN TEXT,IMG TEXT,STATUS INTEGER,CREATE_BY TEXT,CREATE_AT TEXT,UPDATE_BY TEXT,UPDATE_AT TEXT,IS_ONSERVER INT)');
})
.config(function ($httpProvider) 
{
    // $httpProvider.interceptors.push('authInterceptor');
    // $httpProvider.defaults.headers.common['Authorization'] = 'Bearer 7VfRncAwITfZrY2THUGkNq9JZOyExS5u';
})
.controller('AppCtrl', function($ionicLoading,$window,$timeout,$ionicHistory,$rootScope,$scope,$filter,$state,StorageService,MerchantLiteFac) 
{
  var profile               = StorageService.get('profile');
  $scope.profile            = profile;
  var stores                = StorageService.get('LokasiStore');
  $scope.stores             = stores;
  $scope.tglskrg            = $filter('date')(new Date(),'yyyy-MM-dd');
  $scope.appnamaperusahaan  = 'KONTROL GAMPANG';

  MerchantLiteFac.GetMerchant(stores.OUTLET_CODE,1)
  .then(function(responsegetmerchant)
  {
    if(angular.isArray(responsegetmerchant) && responsegetmerchant.length > 0)
    {
        $scope.appmerchant        = responsegetmerchant;
    }
    else
    {
        $scope.appmerchant        = [];
        var datatosave            = {};
        datatosave.TGL_SAVE       = $scope.tglskrg;
        datatosave.OUTLET_CODE    = stores.OUTLET_CODE; 
        datatosave.MERCHANT_NO    = '12345';
        datatosave.MERCHANT_NM    = 'BANK MANDIRI';
        datatosave.MERCHANT_OWNER = 'PITER NOVIAN';
        datatosave.STATUS_DISPLAY = 1;
        datatosave.IS_ONSERVER    = 0;
        MerchantLiteFac.SetMerchant(datatosave)
        .then(function(responsesetmerchat)
        {
          datatosave.id   = responsesetmerchat.insertId;
          $scope.appmerchant.push(datatosave)
        },
        function(errorsetmerchant)
        {
          console.log(errorsetmerchant);
        });
    }
  },
  function(errorgetmerchant)
  {
    console.log(errorgetmerchant);
  });

  $scope.logout = function() 
  {
    StorageService.destroy('profile');
    $timeout(function () 
    {
          $ionicLoading.hide();
          $ionicHistory.clearCache();
          $ionicHistory.clearHistory();
          $ionicHistory.nextViewOptions({ disableBack: true, historyRoot: true });
          $window.location.href = "index.html";
      }, 500);
  };



  $scope.groups = [
                    // {
                    //   name: 'Check Store','icons':'ion-funnel',
                    //   items: [
                    //             {child:'RCVD',path:'#/tab/checkstore-inventory'},
                    //             {child:'BOOK',path:'#/tab/checkstore-booking'},
                    //             {child:'SYNC',path:'#/tab/checkstore-sync'}
                    //           ]
                    // },
                    // {
                    //   name: 'Check HO','icons':'ion-shuffle',
                    //   items: [
                    //             {child:'BOOK',path:'#/tab/ho-inventory'}
                    //           ]
                    // },
                    {
                      name: 'Accounting','icons':'ion-cash',
                      items: [
                                {child:'SUMMARY',path:'#/tab/accounting-summary'},
                                {child:'TRANSACTION',path:'#/tab/accounting-transaksi'},
                                {child:'SETORAN',path:'#/tab/accounting-setoran'}
                                // {child:'OUTCOME',path:'#/tab/accounting-outcome'}
                              ]
                    },
                    {
                      name: 'Employe','icons':'ion-person-stalker',
                      items: [
                                {child:'ABSENSI',path:'#/tab/absensi'}
                              ]
                    },
                    {
                      name: 'Book','icons':'ion-umbrella',
                      items: [
                                {child:'OPEN',path:'#/tab/openbook'},
                                {child:'CLOSE',path:'#/tab/closebook'}
                              ]
                    },
                    {
                      name: 'Control','icons':'ion-wrench',
                      items: [
                                {child:'STORES',path:'#/tab/control/stores'},
                                {child:'PRODUCTS',path:'#/tab/control/product'},
                                {child:'EMPLOYES',path:'#/tab/control/employe'},
                                {child:'MERCHANTS',path:'#/tab/control/merchant'}
                              ]
                    }
                  ];



  $scope.toggleGroup = function(group) 
  {
    if ($scope.isGroupShown(group)) 
    {
      $scope.shownGroup = null;
    } 
    else 
    {
      $scope.shownGroup = group;
    }
  };
  $scope.isGroupShown = function(group) 
  {
    return $scope.shownGroup === group;
  };
});
