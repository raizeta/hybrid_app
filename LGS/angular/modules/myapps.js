'use strict';
var myAppModule 	= angular.module('myAppModule',
['ngRoute','ngResource','ngToast','angularSpinner','ui.bootstrap','ngAnimate',
    'ui.select2','naif.base64','monospaced.qrcode','angular-ladda','angularModalService',
    'ngCordova','ngMap','mm.acl','ng-mfb','ngMaterial','ngMessages','hSweetAlert','ui.calendar']);

myAppModule.run(["$rootScope","$http","$location","uiSelect2Config","LocationService","$window","ngToast","authService","$q","$filter","$cordovaDevice","$timeout","$templateCache",
function ($rootScope,$http,$location,uiSelect2Config,LocationService,$window,ngToast,authService,$q,$filter,$cordovaDevice,$timeout,$templateCache) 
{
    document.addEventListener("deviceready", function () 
      {
        $rootScope.devicemodel = $cordovaDevice.getModel();
        $rootScope.deviceplatform = $cordovaDevice.getPlatform();
        $rootScope.deviceuuid = $cordovaDevice.getUUID();
        $rootScope.deviceversion = $cordovaDevice.getVersion();
      }, false);

    uiSelect2Config.placeholder = "Placeholder text";
    $rootScope.loading= true;
    $rootScope.$on("$routeChangeStart", function (userInfo) 
    {
        $rootScope.loading= true;
        $rootScope.isMenuOpen = false;
    });
   
    $rootScope.$on("$routeChangeSuccess", function (userInfo) 
    {
        var hideloading = function()
        {
            $rootScope.loading= false;
        }
        $timeout(hideloading, 5000);
        
    });

    $rootScope.$on("$routeChangeError", function (event, current, previous, eventObj) 
    {
        if (eventObj.authenticated === false) 
        {
            $location.path("/login");
        }
    });

    var options = {timeout: 10000, enableHighAccuracy: false};

    $rootScope.starttrack = function()
    {
        navigator.geolocation.getCurrentPosition(
        function (options) 
        {
            
            var userauth = $window.sessionStorage["userInfo"];
            $rootScope.authen = JSON.parse(userauth);

            $rootScope.lat = options.coords.latitude;
            $rootScope.long = options.coords.longitude;

            var detail ={};
            detail.USER_ID = $rootScope.authen.username;
            detail.LAT=$rootScope.lat;
            detail.LAG=$rootScope.long;

            function serializeObj(obj) 
            {
              var result = [];
              for (var property in obj) result.push(encodeURIComponent(property) + "=" + encodeURIComponent(obj[property]));
              return result.join("&");
            }

            var serialized = serializeObj(detail); 
            var config = 
            {
                headers : 
                {
                    'Accept': 'application/json',
                    'Content-Type': 'application/x-www-form-urlencoded;application/json;charset=utf-8;'
                    
                }
            };
                
            $http.post("http://api.lukisongroup.com/master/trackers",serialized,config)
            .success(function(data,status, headers, config) 
            {
                //ngToast.create('Detail Telah Berhasil Di Update');
            })

            .finally(function()
            {
                $rootScope.loading = false;  
            });
        },
        function(err)
        {
          alert("GPS Tidak Hidup.Hidupkan GPS Untuk Menikmati Fitur Ini");
        });
    }

    $rootScope.tanggalharini = $filter('date')(new Date(),'yyyy-MM-dd');
    var tanggal = $filter('date')(new Date(),'yyyy-MM-dd HH:mm:ss');
    var tanggalmulai = $filter('date')(new Date(),'yyyy-MM-dd 05:00:00');
    var tanggalakhir = $filter('date')(new Date(),'yyyy-MM-dd 23:59:59');


    if( (tanggal > tanggalmulai) && (tanggal < tanggalakhir))
    {
        setInterval(function() 
        {
            $rootScope.starttrack();
        }, 30000);
    }

    var getUrl = function()
    {
        return "http://api.lukisongroup.com/master";
    }

    var gettoken = function()
    {
        return "?access-token=azLSTAYr7Y7TLsEAML-LsVq9cAXLyAWa";
    }
    
    $rootScope.linkurl = getUrl();

    // https://jsfiddle.net/Guffa/Askwb/
    // Remove Duplicate Array
    $rootScope.unique = function(list) 
    {
        var result = [];
        $.each(list, function(i, e) 
        {
            if ($.inArray(e, result) == -1) 
            {
                result.push(e);
            }
        });
        
        return result;
    }
    
    $rootScope.diffbarang = function(x,y)
    {
        var resultdiffsellin = [];
        angular.forEach(x, function(key) 
        {
          if (-1 === y.indexOf(key)) 
          {
            resultdiffsellin.push(key);
          }
        });

        var result=[];
        for(var i =0; i < resultdiffsellin.length; i++)
        {
            var data = {}
            data.KD_BARANG = resultdiffsellin[i];
            result.push(data);
        }

        return result;
    }

    $rootScope.databarangs = function(x)
    {
        var dataproduct = $.ajax
        ({
              url: $rootScope.linkurl  + "/barangpenjualans/search?KD_CORP=ESM&KD_KATEGORI=01&STATUS=1",
              type: "GET",
              dataType:"json",
              async: false
        }).responseText;

        var Product = JSON.parse(dataproduct)['BarangPenjualan'];
        var result = [];
        angular.forEach(Product, function(value, key)
        {
            var KD_BARANG = value.KD_BARANG;
            result.push(KD_BARANG);
        });
        return result;
    }
    
    $rootScope.objectdatabarangs = function()
    {
        var dataproduct = $.ajax
        ({
              url: $rootScope.linkurl  + "/barangpenjualans/search?KD_CORP=ESM&KD_KATEGORI=01&STATUS=1",
              type: "GET",
              dataType:"json",
              async: false
        }).responseText;

        var Product = JSON.parse(dataproduct)['BarangPenjualan'];
        var result = [];
        angular.forEach(Product, function(value, key)
        {
            var product = {};
            product.KD_BARANG = value.KD_BARANG;
            product.NM_BARANG = value.NM_BARANG;
            result.push(product);
        });
        return result;
    }

    $rootScope.jadwalkunjungans = function(tglkunjungan,userid)
    {
        var datajadwalkunjungan = $.ajax
        ({
              url: $rootScope.linkurl  + "/jadwalkunjungans/search?TGL1=" + tglkunjungan + "&USER_ID=" + userid,
              type: "GET",
              dataType:"json",
              async: false
        }).responseText;

        var jadwalkunjungan = JSON.parse(datajadwalkunjungan)['JadwalKunjungan'];
        var result = [];
        angular.forEach(jadwalkunjungan, function(value, key)
        {
            var SCDL_GROUP = value.SCDL_GROUP;
            result.push(SCDL_GROUP);
        });
        return result;
    }

    $rootScope.searchdatabarangs = function(kodebarang)
    {
        var dataproduct = $.ajax
        ({
              url: $rootScope.linkurl  + "/barangpenjualans/search?KD_CORP=ESM&KD_KATEGORI=01&KD_BARANG=" + kodebarang,
              type: "GET",
              dataType:"json",
              async: false
        }).responseText;

        var Product = JSON.parse(dataproduct)['BarangPenjualan'];
        var result = [];
        angular.forEach(Product, function(value, key)
        {
            var NM_BARANG = value.NM_BARANG;
            result.push(NM_BARANG);
        });
        return result;
    }

    $rootScope.databaranginventory = function(idcustomer,tanggalplan,sotype)
    {
        var inventorysellin = $.ajax
        ({
              url: $rootScope.linkurl + "/productinventories/search?CUST_KD=" + idcustomer + "&TGL=" + tanggalplan + "&SO_TYPE=" + sotype,
              type: "GET",
              dataType:"json",
              async: false
        }).responseText;

        var sellin = JSON.parse(inventorysellin)['ProductInventory'];
        var result = [];
        angular.forEach(sellin, function(value, key)
        {
            var KD_BARANG = value.KD_BARANG;
            result.push(KD_BARANG);
        });
        return result;
    }

    $rootScope.databarangexpired = function(iddetail)
    {
        var barangexpired = $.ajax
        ({
              url: $rootScope.linkurl + "/expiredproducts/search?ID_DETAIL=" + iddetail,
              type: "GET",
              dataType:"json",
              async: false
        }).responseText;
        var expired = JSON.parse(barangexpired)['ExpiredProduct'];
        var result = [];
        angular.forEach(expired, function(value, key)
        {
            var KD_BARANG = value.BRG_ID;
            result.push(KD_BARANG);
        });
        var x = $rootScope.unique(result);
        return x;
    }

    $rootScope.updateinventoryquantity = function(idinventory)
    {
        var result = {}
        if(idinventory == 1)
        {
            result.titledialog                 = 'Stock Quantity';
            result.sotype                      = 5;
            result.arraybarang                 = $rootScope.barangstockqty;
            result.INVENTORY_STOCK = 1;

        }
        else if(idinventory == 2)
        {
            result.titledialog                     = 'Sell Out Quantity';
            result.sotype                          = 7;
            result.arraybarang                     = $rootScope.barangsellout;
            result.INVENTORY_STOCK = 2;
        }
        else if(idinventory == 3)
        {
            result.titledialog                     = 'Sell In Quantity';
            result.sotype                          = 6;
            result.arraybarang                     = $rootScope.barangsellin;
            result.INVENTORY_STOCK = 3;
        }
        return result;
    }

    $rootScope.updatestatusinventoryquantity = function(idinventory)
    {
        var result = {}
        if(idinventory == 1)
        {
            result.INVENTORY_STOCK = 1;
        }
        else if(idinventory == 2)
        {
            result.INVENTORY_SELLOUT   = 1;
        }
        else if(idinventory == 3)
        {
            result.INVENTORY_SELLIN    = 1;
        }
        return result;
    }

    $rootScope.singledetailkunjunganbyiddetail = function(iddetail)
    {
        var resultsingledetailkunjunganbyiddetail = $.ajax
        ({
              url: $rootScope.linkurl  + "/detailkunjunganbyiddetails/search?ID=" + iddetail,
              type: "GET",
              dataType:"json",
              async: false
        }).responseText;
        var result = JSON.parse(resultsingledetailkunjunganbyiddetail)['DetailKunjungan'][0];
        return result;
    }

    $rootScope.cekstatuspanjangdiffbarang = function(diffbarang)
    {
        var status={};
        if(diffbarang.length == 0)
        {
            status.bgcolor="bg-green";
            status.icon="fa fa-check bg-green";
            status.show = false;
        }
        else
        {
            status.bgcolor="bg-aqua";
            status.show= true;
            status.icon = "fa fa-close bg-aqua";
        }

        return status;
    }

    $rootScope.cekstatusbarang = function(statusvalue)
    {
        var status={};
        if(statusvalue == 1)
        {
            status.bgcolor="bg-green";
            status.icon="fa fa-check bg-green";
            status.show = false;
        }
        else if(statusvalue == 0)
        {
            status.bgcolor="bg-aqua";
            status.show= true;
            status.icon = "fa fa-close bg-aqua";
        }

        return status;
    }

    $rootScope.seriliazeobject = function(objecttoserialize)
    {
        var result={};
        function serializeObj(obj) 
        {
          var result = [];
          for (var property in obj) result.push(encodeURIComponent(property) + "=" + encodeURIComponent(obj[property]));
          return result.join("&");
        }
        
        var serialized = serializeObj(objecttoserialize); 
        var config = 
        {
            headers : 
            {
                'Accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded;application/json;charset=utf-8;'   
            }
        };
        result.serialized   = serialized;
        result.config       = config;

        return result;
    }

    $rootScope.findidstatuskunjunganbyiddetail = function(iddetail)
    {
        var findidstatuskunjunganbyiddetail = $.ajax
        ({
              url: $rootScope.linkurl  + "/statuskunjungans/search?ID_DETAIL=" + iddetail,
              type: "GET",
              dataType:"json",
              async: false
        }).responseText;
        var result = JSON.parse(findidstatuskunjunganbyiddetail)['StatusKunjungan'][0].ID;
        return result;
    }

    $rootScope.getCameraOptions = function()
    {
        
        var options = {
                quality: 100,
                destinationType: Camera.DestinationType.DATA_URL,
                sourceType: Camera.PictureSourceType.CAMERA,
                allowEdit: false,
                encodingType: Camera.EncodingType.JPEG,
                targetWidth: 100,
                targetHeight: 100,
                popoverOptions: CameraPopoverOptions,
                saveToPhotoAlbum: false,
                correctOrientation:true
              };
        return options;
    }

    $rootScope.jaraklokasi = function(longitude1,latitude1,longitude2,latitude2)
    {
        var thetalong      = (longitude1 - longitude2)*(Math.PI / 180); 
        var thetalat       = (latitude1 - latitude2)*(Math.PI / 180);
        var a = 0.5 - Math.cos(thetalat)/2 + Math.cos(latitude1 * Math.PI / 180) * Math.cos(latitude2 * Math.PI / 180) * (1 - Math.cos(thetalong))/2;
        var jarak = 12742 * Math.asin(Math.sqrt(a)) * 1000;
        return jarak;
    }

}]);

myAppModule.config(['$httpProvider','$locationProvider','ngToastProvider','$mdThemingProvider',"usSpinnerConfigProvider", 
function($httpProvider,$locationProvider, ngToastProvider,$mdThemingProvider,usSpinnerConfigProvider) 
{
    //usSpinnerConfigProvider.setDefaults({color: 'blue'});
    usSpinnerConfigProvider.setTheme('bigBlue', {color: 'blue', radius: 20});
    usSpinnerConfigProvider.setTheme('smallRed', {color: 'red', radius: 6});

    $httpProvider.interceptors.push('timestampMarker');
    $httpProvider.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
    $httpProvider.defaults.withCredentials = true;
    $httpProvider.defaults.useXDomain = true;
    delete $httpProvider.defaults.headers.common["X-Requested-With"];


    $mdThemingProvider.theme('altTheme')
    .primaryPalette('pink', {
      'default': '400', // by default use shade 400 from the pink palette for primary intentions
      'hue-1': '100', // use shade 100 for the <code>md-hue-1</code> class
      'hue-2': '600', // use shade 600 for the <code>md-hue-2</code> class
      'hue-3': 'A100' // use shade A100 for the <code>md-hue-3</code> class
    })
    // If you specify less than all of the keys, it will inherit from the
    // default shades
    .accentPalette('purple', {
      'default': '200' // use shade 200 for default, and keep all other shades the same
    });


    //$locationProvider.html5Mode(false);
      
    ngToastProvider.configure(
    {
        animation: 'slide', // or 'fade',
        className: 'success',
        dismissButton: true,
        dismissButtonHtml:'&times;',
        compileContent: true,
        timeout:1000,
        horizontalPosition:'right',     //left, center
        verticalPosition:   'bottom',  //top,center
        maxNumber: 3 // 0 for unlimited
    });

}]);


myAppModule.filter('singleDecimal', function ($filter) {
    return function (input) {
        if (isNaN(input)) return input;
        return Math.round(input * 10) / 10;
    };
});

myAppModule.filter('setDecimal', function ($filter) {
    return function (input, places) {
        if (isNaN(input)) return input;
        // If we want 1 decimal place, we want to mult/div by 10
        // If we want 2 decimal places, we want to mult/div by 100, etc
        // So use the following to create that factor
        var factor = "1" + Array(+(places > 0 && places + 1)).join("0");
        return Math.round(input * factor) / factor;
    };
});



