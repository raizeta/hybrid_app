angular.module('starter')
.controller('JadwalCtrl', function($scope,$state,$ionicModal,$ionicLoading,uiCalendarConfig,JadwalFac,StorageService) 
{
    console.log($scope.profile);
    $scope.events = [];
    JadwalFac.GetJadwal($scope.profile.ACCESS_UNIX)
    .then(function(responsegetjadwal)
    {
        angular.forEach(responsegetjadwal, function(value, key)
        {
            var data ={};
            
            data.start = new Date(value.TGL);
            data.allDay =true;
            data.url ="#/tab/jadwal/" + value.TGL;
            if(value.STATUS)
            {
                data.title = 'FINISH';
                data.color = '#378006';  
            }
            else
            {
                data.title = 'PROGRESS';
                data.color = '#dd4b39';
            }
            data.stick = true;
            $scope.events.push(data); 
        });
    },
    function(errorgetjadwal)
    {
        console.log(errorgetjadwal);
    });
    $scope.uiConfig = 
    {
      calendar:
      {
        height: 450,
        editable: false,
        header:
        {
          left: 'title',
          center: '',
          right: ''
        },

        eventClick: $scope.alertOnEventClick,
        eventDrop: $scope.alertOnDrop,
        eventResize: $scope.alertOnResize,
        eventRender: $scope.eventRender
      }
    };
    $scope.eventSources = [$scope.events];	
})
.controller('JadwalDetailCtrl', function($scope,$stateParams,$state,$ionicModal,$ionicLoading,JadwalFac) 
{
    $scope.params       = $stateParams.detail;
    $ionicLoading.show
    ({
      template: 'Loading...'
    })
    .then(function()
    {
        JadwalFac.GetJadwalDetail($scope.profile.ACCESS_UNIX,$scope.params)
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

    $scope.openmodalratingjelek = function()
    {
        $ionicModal.fromTemplateUrl('templates/jadwal/ratingjelek.html', 
        {
            scope: $scope,
            animation: 'slide-in-up',
            backdropClickToClose: false,
            hardwareBackButtonClose: true
        })
        .then(function(modal) 
        {
            $scope.alasan = [
                            {'todo':'Tidak Sopan','checked':false},
                            {'todo':'Bermalas Ria','checked':false},
                            {'todo':'Merokok Pas Bekerja','checked':false},
                            {'todo':'Semberawutan','checked':false}
                        ];
            $scope.modalratingjelek  = modal;
            $scope.modalratingjelek.show();
        });
    }
    $scope.closemodalratingjelek = function()
    {
        $scope.modalratingjelek.hide();
    }

    $scope.openmodaldetailuser = function(pekerja)
    {
        console.log(pekerja);
        $ionicModal.fromTemplateUrl('templates/jadwal/users.html', 
        {
            scope: $scope,
            animation: 'slide-in-up',
            backdropClickToClose: false,
            hardwareBackButtonClose: true
        })
        .then(function(modal) 
        {
            $scope.detailpekerja    = pekerja;
            $scope.modaldetail  = modal;
            $scope.modaldetail.show();
        });
    }
    $scope.closemodaldetailuser = function()
    {
        $scope.modaldetail.hide();
    }

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