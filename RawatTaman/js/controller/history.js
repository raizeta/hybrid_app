angular.module('starter')
.controller('HistoryCtrl', function($scope,$state,$location,$ionicModal,$ionicLoading,JadwalFac) 
{
    $ionicLoading.show
    ({
        template: 'Loading...'
    })
    .then(function()
    {
        JadwalFac.GetJadwal('20170404081602')
        .then(function(responsegetjadwal)
        {
            $scope.datajadwal = responsegetjadwal;
        },
        function(errorgetjadwal)
        {
            console.log(errorgetjadwal);
        })
        .finally(function()
        {
            $ionicLoading.hide();
        });
    });
    $scope.openmodaldetail = function(jadwal)
    {
        console.log(jadwal);
        $location.path("/tab/history/detail");
    }
})
.controller('HistoryDetailCtrl', function($scope,$state,$ionicModal,$ionicLoading,JadwalFac) 
{
    $ionicLoading.show
    ({
        template: 'Loading...'
    })
    .then(function()
    {
        JadwalFac.GetJadwalDetail('20170404081602',$scope.params)
        .then(function(responsegetdetailjadwal)
        {
            $scope.datadetail = responsegetdetailjadwal[0];
            console.log($scope.datadetail);
        },
        function(errorgetdetailjadwal)
        {
            console.log(errorgetjadwal);
        })
        .finally(function()
        {
            $ionicLoading.hide();
        });
    });
    $scope.ratingsObject = {
        iconOn: 'ion-ios-star',    //Optional
        iconOff: 'ion-ios-star-outline',   //Optional
        iconOnColor: 'rgb(200, 200, 100)',  //Optional
        iconOffColor:  'rgb(200, 100, 100)',    //Optional
        rating:  0, //Optional
        minRating:0,    //Optional
        readOnly: false, //Optional
        callback: function(rating, index) 
        {    //Mandatory
          $scope.ratingsCallback(rating, index);
        }
      };
  
      $scope.ratingsCallback = function(rating, index) 
      {
        if(rating <= 3)
        {
            console.log('Selected rating is : ', rating, ' and the index is : ', index);
            $scope.openmodalratingjelek();
        }
      }; 

      $scope.todolist = [
                            {'todo':'Merias','checked':true},
                            {'todo':'Menghias','checked':true},
                            {'todo':'Memupuk','checked':true},
                            {'todo':'Merawat','checked':true}
                        ];
});