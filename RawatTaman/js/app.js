// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic','ionic-ratings','ui.calendar','auth0'])

.run(function($ionicPlatform,$location,auth,$rootScope,StorageService) 
{
  auth.hookEvents();
  $ionicPlatform.ready(function() 
  {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
  $rootScope.$on('$stateChangeStart', function (event,next, nextParams, fromState) 
    {
         var token = StorageService.get('token');
         if (!token) 
         {
            $location.path('/auth/login');
          }
    });
})
.controller('AppCtrl', function($rootScope,$scope,$filter,$state,StorageService) 
{
    $scope.tglskrg            = $filter('date')(new Date(),'yyyy-MM-dd');
    var menus       = [];
    menus.push({src: "img/200x200/schedule.png",link:"#/tab/jadwal",judul:"Jadwal",keterangan:null});
    menus.push({src: "img/200x200/history.png",link:"#/tab/history",judul:"History",keterangan:null});
    menus.push({src: "img/200x200/feedback.jpg",link:"#/tab/feedback",judul:"FeedBack",keterangan:null});
    menus.push({src: "img/200x200/information.png",link:"#/tab/informasi",judul:"Informasi",keterangan:'DEV'});
    menus.push({src: "img/200x200/setting.png",link:"#/tab/setting",judul:"Pengaturan",keterangan:'DEV'});
    $scope.menus = menus;

    // $scope.ratingsObject = {
    //     iconOn: 'ion-ios-star',    //Optional
    //     iconOff: 'ion-ios-star-outline',   //Optional
    //     iconOnColor: 'rgb(200, 200, 100)',  //Optional
    //     iconOffColor:  'rgb(200, 100, 100)',    //Optional
    //     rating:  0, //Optional
    //     minRating:0,    //Optional
    //     readOnly: true, //Optional
    //     callback: function(rating, index) {    //Mandatory
    //       $scope.ratingsCallback(rating, index);
    //     }
    //   };
  
    //   $scope.ratingsCallback = function(rating, index) {
    //     console.log('Selected rating is : ', rating, ' and the index is : ', index);
    //   };

});
