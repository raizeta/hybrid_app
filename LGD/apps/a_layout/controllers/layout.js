
angular.module('starter')
 
.controller('AppCtrl', function($rootScope,$scope, $state,StorageService) 
{
  var profile = StorageService.get('profile');
  $scope.profile = profile;
  $scope.logout = function() 
  {
      StorageService.destroy('profile');
      $state.go('auth.login',{},{reload: true});
  };

  
})

.controller('DashboardCtrl', 
function($window,$rootScope,$scope, $state,$ionicPopup,$ionicLoading,UtilService,ProductService,ArrayObjectService,StorageService,auth,MenuService,DateService) 
{
    var profile     = StorageService.get('profile');
    $scope.profile  = profile;
    var menus       = [];
    menus.push({src: "assets/img/img/200x200/chart.jpg",link:"#/main/charts",judul:"Chart",keterangan:null});
    menus.push({src: "assets/img/img/200x200/ro.png",link:"#/main/po/inbox",judul:"PO",keterangan:null});
    menus.push({src: "assets/img/img/200x200/chat.png",link:"#/main/ba/inbox",judul:"B.Acara",keterangan:null});
    menus.push({src: "assets/img/img/200x200/money.png",link:"",judul:"SCM",keterangan:'DEV'});
    menus.push({src: "assets/img/img/200x200/meeting.png",link:"",judul:"CRM",keterangan:'DEV'});
    menus.push({src: "assets/img/img/200x200/hrm.png",link:"",judul:"HRM",keterangan:'DEV'});
    
    // menus.push({src: "assets/img/img/200x200/chat.png",link:"",judul:"Chat"});
    
    $scope.menus        = UtilService.ArrayChunk(menus,4);
    $rootScope.sidemenu = MenuService.DashboardMenu();
    var x = DateService.GetWeekOf(new Date());
    var y = DateService.GetDayOf(new Date());

});