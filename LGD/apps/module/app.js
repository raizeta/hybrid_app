angular.module('starter', ['ionic','ng-fusioncharts','angular.filter','twitterFeed.filters','ngSanitize', 'ngCordova','ngMap','ionic-datepicker','ionic-letter-avatar'])

.run(function($ionicPlatform,$rootScope, $state,$window,$filter,StorageService) 
{
    $ionicPlatform.ready(function() 
    {
        if(window.cordova && window.cordova.plugins.Keyboard) 
        {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            cordova.plugins.Keyboard.disableScroll(true);
        }
        if(window.StatusBar) 
        {
            StatusBar.styleDefault();
        } 
    });
    $rootScope.$on('$stateChangeStart', function (event,next, nextParams, fromState) 
    {

    });

    $rootScope.tanggalwaktuharini = $filter('date')(new Date(),'yyyy-MM-dd HH:mm:ss');
    $rootScope.hanyatanggalharini = $filter('date')(new Date(),'yyyy.MM.dd');
 
})

.config(function (ionicDatePickerProvider) {
    var datePickerObj = {
      inputDate: new Date(),
      titleLabel: 'Select a Date',
      setLabel: 'Set',
      todayLabel: 'Today',
      closeLabel: 'Close',
      mondayFirst: false,
      weeksList: ["S", "M", "T", "W", "T", "F", "S"],
      monthsList: ["Jan", "Feb", "March", "April", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"],
      templateType: 'popup',
      from: new Date(2012, 8, 1),
      to: new Date(2018, 8, 1),
      showTodayButton: true,
      dateFormat: 'dd MMMM yyyy',
      closeOnSelect: false,
      disableWeekdays: []
    };
    ionicDatePickerProvider.configDatePicker(datePickerObj);
  });




