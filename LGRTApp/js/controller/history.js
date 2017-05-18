angular.module('starter')
.controller('HistoryCtrl', function($scope,$state,$location,$ionicModal,$ionicLoading,JadwalFac) 
{
    $ionicLoading.show
    ({
        template: 'Loading...'
    })
    .then(function()
    {
        JadwalFac.GetJadwal($scope.profile.ACCESS_UNIX)
        .then(function(responsegetjadwal)
        {
            $scope.datajadwal = responsegetjadwal;
            console.log($scope.datajadwal);
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
        $location.path("/tab/history/" + jadwal.TGL);
    }
})
.controller('HistoryDetailCtrl', function($scope,$state,$stateParams,$ionicModal,$ionicScrollDelegate,$ionicSlideBoxDelegate,$ionicLoading,JadwalFac,UtilService) 
{
    $scope.params       = $stateParams.detail;
    $scope.ratingsObject = UtilService.GetRatingConfig();
    $scope.ratingsObject.readOnly   = true;
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
            JadwalFac.GetRatings($scope.datadetail.ID)
            .then(function(responsegetratings)
            {
                if(angular.isArray(responsegetratings) && responsegetratings.length > 0)
                {
                    $scope.datarating               = responsegetratings[0];
                    $scope.ratingsObject.rating     = $scope.datarating.NILAI;
                } 
            },
            function(errorgetratings)
            {
                console.log(errorgetratings);
            });
        },
        function(errorgetdetailjadwal)
        {
            console.log(errorgetdetailjadwal);
        })
        .finally(function()
        {
            $ionicLoading.hide();
        });

    });

    $scope.giverating           = UtilService.GetRatingConfig();
    $scope.giverating.readOnly  = false;
    
    $scope.giverating.callback = function(rating, index) 
    {    //Mandatory
      $scope.ratingsCallback(rating, index);
    }
    $scope.ratingsCallback = function(rating, index) 
    {
        if(rating <= 3)
        {
            $scope.pilihalasan = true;
        }
        else
        {
            $scope.pilihalasan = false;
        }
        $scope.ratinggiven = rating;
    };
    
    $scope.openmodalratingjelek = function()
    {
        $ionicModal.fromTemplateUrl('templates/history/ratingjelek.html', 
        {
            scope: $scope,
            animation: 'slide-in-up',
            backdropClickToClose: false,
            hardwareBackButtonClose: true
        })
        .then(function(modal) 
        {

            $scope.giverating.rating    = $scope.ratingsObject.rating;
            $scope.alasan = [
                            {'todo':'Tidak Sopan','checked':false},
                            {'todo':'Bermalas Ria','checked':false},
                            {'todo':'Merokok Pas Bekerja','checked':false},
                            {'todo':'Semberawutan','checked':false}
                        ];
            $scope.komentarrating = {'alasan':null};
            $scope.modalratingjelek  = modal;
            $scope.modalratingjelek.show();
        });
    }
    $scope.closemodalratingjelek = function()
    {
        // $scope.ratingsObject.rating = $scope.ratinggiven;
        $scope.modalratingjelek.hide();
    }
    $scope.submitmodalrating = function()
    {

        var starsawal   = $scope.ratingsObject.rating;
        var starsresult = $scope.ratinggiven;
        JadwalFac.SetRatings($scope.datadetail.ID,starsawal,starsresult,$scope.komentarrating.alasan)
        .then(function(responseupdaterating)
        {
            $scope.ratingsObject.rating = starsresult;
        },
        function(errorupdaterating)
        {
            console.log(errorupdaterating);
        });
        $scope.modalratingjelek.hide();  
    }
    $scope.openModalImages = function(index) 
    {
        
        $scope.activeSlide = index;
        $scope.showModaImages('templates/history/modalgambar.html');
    }
     $scope.zoomMin = 1;
    $scope.showModaImages = function(templateUrl) 
    {
        $ionicModal.fromTemplateUrl(templateUrl, 
        {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function(modal) 
        {
            $scope.gambar = $scope.datarating.PHOTO_HASIL;
            $scope.modalimages = modal;
            $scope.modalimages.show();
        });
    }
 
    $scope.closeModalImages = function() 
    {
        $scope.modalimages.hide();
        $scope.modalimages.remove()
    };

    $scope.getimageprefix = function(itemimage)
    {
        var png  = itemimage.IMAGE_64.search("data:image/png;base64");
        var jpg  = itemimage.IMAGE_64.search("data:image/jpg;base64");
        if((png == -1) && (jpg == -1))
        {
            itemimage.IMAGE_64 = 'data:image/png;base64,' + itemimage.IMAGE_64;
        }
        else
        {
            itemimage.IMAGE_64           = itemimage.IMAGE_64;
        }
        return itemimage.IMAGE_64;
    }

    $scope.updateSlideStatus = function(slide) 
    {
      var zoomFactor = $ionicScrollDelegate.$getByHandle('scrollHandle' + slide).getScrollPosition().zoom;
      if (zoomFactor == $scope.zoomMin) 
      {
        $ionicSlideBoxDelegate.enableSlide(true);
      } 
      else 
      {
        $ionicSlideBoxDelegate.enableSlide(false);
      }
    };

    $scope.openmodaldetailuser = function(pekerja)
    {
        $ionicModal.fromTemplateUrl('templates/history/users.html', 
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
});