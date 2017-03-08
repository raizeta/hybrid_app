'use strict';
myAppModule.controller("NOOController",
function ($rootScope,$scope,$location,auth,$window,$filter,$cordovaCamera,$cordovaCapture,CustomerFac,CustomerSqliteFac,focus,StorageService) 
{   
    focus('focusUsername');
    $scope.activenoo  = "active";
    $scope.userInfo = auth;
    $scope.customer = {};
    $scope.customer.ktp     = auth.gambar;
    $scope.customer.npwp    = auth.gambar;
    $scope.customer.siub    = auth.gambar;
    $scope.customer.ttd     = auth.gambar;
    $scope.customer.FS1     = auth.gambar;
    $scope.customer.FS2     = auth.gambar;

    $scope.logout = function () 
    { 
        $scope.userInfo = null;
        $window.sessionStorage.clear();
        window.location.href = "index.html";
    }

    $scope.submitForm = function(customer)
    {
        var yakinsubmit = confirm("Apakah Kamu Sudah Yakin?");
        if (yakinsubmit == true) 
        {
            $scope.loadingcontent = true;
            var customer        = customer;
            customer.CUST_GRP   = 'CUS.2016.000637';
            customer.JOIN_DATE  = $filter('date')(new Date(),'yyyy-MM-dd');
            customer.STT_TOKO   = '1';
            customer.CREATED_BY = auth.username;

            CustomerFac.SetCustomers(customer) 
            .then( function(response)
            {                    
                CustomerSqliteFac.SetCustomers(response)
                .then(function(responselocal)
                {
                    var lanjutlist = confirm("Customer NOO Sukses Disimpan.Lanjut Ke List?");
                    if (lanjutlist == true) 
                    {
                        $location.path("/listnoo");
                    }
                    else
                    {
                        $scope.customer = null;
                    }
                },
                function(error)
                {
                    alert("Gagal Menyimpan Ke Local");
                });  
            },
            function(error)
            {
                alert("Customer Gagal Ditambahkan.Ulangi Lagi!");
            })
            .finally(function()
            {
                $scope.loadingcontent = false;
            });

        }       
    }
});

myAppModule.controller("ListNOOController",
function ($window,$timeout,$rootScope,$scope,$location,auth,$filter,StorageService,CustomerFac,CustomerSqliteFac,focus,ModalService) 
{   
    $scope.userInfo = auth;
    $scope.activelistnoo  = "active";
    $scope.logout = function () 
    { 
        $scope.userInfo = null;
        $window.sessionStorage.clear();
        window.location.href = "index.html";
    }

    $scope.loadingcontent = true;
    CustomerFac.GetNooCustomers(auth.username)
    .then(function(response)
    {
        $scope.noocustomers = response;
    },
    function(error)
    {

    })
    .finally(function()
    {
        $scope.loadingcontent = false;
    });
    $scope.showmodal = function(item) 
    {
        console.log(item);
        ModalService
        .showModal(
        {
          templateUrl: "angular/partial/salesman/noomodal.html",
          controller: "NooModalController",
          inputs: 
          {
            title: item
          }
        })
        .then(function(modal) 
        {
            modal.element.modal(function ()
            {
                alert("Button OK Klick");
            });
            modal.close.then(function(result) 
            {
                $scope.loadingcontent = true;
                var data    = result.customer;
                data.TLP2   = 1234567890;
                data.FAX    = 1234567890;
                CustomerFac.UpdateCustomers(data)
                .then(function(response)
                {
                    console.log(response);
                    alert("Data Customer Berhasil Diubah");
                },
                function(error)
                {
                    console.log(error);
                    alert("Data Customer Gagal Diubah");
                })
                .finally(function()
                {
                    $scope.loadingcontent = false;
                });

            });
        });   
    };

    $scope.showberkas   = function(item)
    {
        StorageService.set('berkasitem',item);
        var CUST_ID     = item.CUST_KD;
        $location.path("/berkasnoo/" + CUST_ID);
    };  
});

myAppModule.controller('BerkasNOOController',
function($window,$rootScope,$scope,$http,$filter,auth,$cordovaCamera,$cordovaCapture,StorageService,CustomerFac) 
{
    $scope.userInfo     = auth;
    $scope.logout = function () 
    { 
        $scope.userInfo = null;
        $window.sessionStorage.clear();
        window.location.href = "index.html";
    }
    $scope.activelistnoo  = "active";
    
    var statusaction        = {};
    statusaction.bgcolor    = "bg-aqua";
    statusaction.icon       = "fa fa-close bg-aqua";
    statusaction.show       = false;
    $scope.statusKTP        = statusaction;
    $scope.statusNPWP       = statusaction;
    $scope.statusSIUB       = statusaction;
    $scope.statusTTD        = statusaction;
    $scope.statusFS1        = statusaction;
    $scope.statusFS2        = statusaction;

    
    var berkasdata      = StorageService.get('berkasitem');
    $scope.customers    = berkasdata;
    $scope.loadingcontent = true;
    CustomerFac.GetCustomersBerkas(berkasdata.CUST_KD)
    .then(function(response)
    {
        
        if(angular.isArray(response) && response.length > 0)
        {
            angular.forEach(response,function(value,key)
            {
                var statusaction        = {};
                statusaction.bgcolor    = "bg-green";
                statusaction.icon       = "fa fa-check bg-green";
                statusaction.show       = true;

                if(value.DCRIPT == 'KTP')
                {
                    $scope.statusKTP        = statusaction;
                }
                if(value.DCRIPT == 'NPWP')
                {
                    $scope.statusNPWP        = statusaction;
                }
                if(value.DCRIPT == 'SIUB')
                {
                    $scope.statusSIUB        = statusaction;
                }
                if(value.DCRIPT == 'TTD')
                {
                    $scope.statusTTD        = statusaction;
                }
                if(value.DCRIPT == 'FS1')
                {
                    $scope.statusFS1        = statusaction;
                }
                if(value.DCRIPT == 'FS2')
                {
                    $scope.statusFS2        = statusaction;
                }
            });
        }
    },
    function(error)
    {
        console.log(error);
    })
    .finally(function()
    {
        $scope.loadingcontent = false;
    });

    $scope.ambilgambar = function(keterangan)
    {
        document.addEventListener("deviceready", function () 
        {
            var options = $rootScope.getCameraOptions();
            $cordovaCamera.getPicture(options)
            .then(function (imageData) 
            {
                var data = {};
                data.CUST_KD        = berkasdata.CUST_KD;
                data.IMG_NM_BASE64  = imageData;
                data.DCRIPT         = keterangan;
                data.STATUS         = 1;
                data.CREATE_AT      = $filter('date')(new Date(),'yyyy-MM-dd HH:mm:ss');
                data.CREATE_BY      = auth.id;
                $scope.loadingcontent = true;
                CustomerFac.SetCustomersBerkas(data)
                .then(function(responseberkas)
                {
                    alert("Berkas "+ keterangan +" Berhasil Disimpan");
                    var statusaction        = {};
                    statusaction.bgcolor    = "bg-green";
                    statusaction.icon       = "fa fa-check bg-green";
                    statusaction.show       = true;
                    $scope['status' + keterangan]    = statusaction;
                },
                function(error)
                {
                    alert("Berkas Gagal Disimpan");
                })
                .finally(function()
                {
                    $scope.loadingcontent = false; 
                });   
            }, 
            function(err) 
            {
                $scope.loadingcontent = false;
            });

        }, false);
    }
});

myAppModule.controller('NooModalController', ['$rootScope','$scope', '$http','$element', 'title', 'close',"$filter",
function($rootScope,$scope, $http,$element, title, close,$filter) 
{

    $scope.title        = title.CUST_NM;
    $scope.customer     = title;
    console.log(title.ALAMAT_KIRIM);
    $scope.customer.KTP = Number(title.KTP);
    $scope.close = function() 
    {
        close({customer:title,title:$scope.title}, 500); // close, but give 500ms for bootstrap to animate
        alert("Lanjut Proses Menyimpan Data?");
    };

    $scope.cancel = function() 
    {
        $element.modal('hide');
    };

}]);



