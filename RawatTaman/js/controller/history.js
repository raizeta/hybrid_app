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
    $scope.ratingsKaryawan = {
        iconOn: 'ion-ios-star',    //Optional
        iconOff: 'ion-ios-star-outline',   //Optional
        iconOnColor: 'rgb(200, 200, 100)',  //Optional
        iconOffColor:  'rgb(200, 100, 100)',    //Optional
        rating:  4, //Optional
        minRating:4,    //Optional
        readOnly: true, //Optional
      };
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

    $scope.gambar = [{'namagambar':'img/ben.png'},{'namagambar':'img/adam.jpg'},{'namagambar':'img/ben.png'},{'namagambar':'img/adam.jpg'}];
    $scope.openModalImages = function(index) 
    {
        
        $scope.activeSlide = index;
        $scope.showModaImages('templates/jadwal/modalgambar.html');
    }
    
    $scope.showModaImages = function(templateUrl) 
    {
        $ionicModal.fromTemplateUrl(templateUrl, 
        {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function(modal) 
        {
            $scope.gambar = [{'namagambar':'img/ben.png'},{'namagambar':'img/adam.jpg'},{'namagambar':'img/ben.png'},{'namagambar':'img/adam.jpg'}];
            $scope.modalimages = modal;
            $scope.modalimages.show();
        });
    }
 
    $scope.closeModalImages = function() 
    {
        $scope.modalimages.hide();
        $scope.modalimages.remove()
    };
});