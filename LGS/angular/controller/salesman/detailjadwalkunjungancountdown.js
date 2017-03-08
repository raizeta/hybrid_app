//http://localhost/radumta_folder/production/crmprod/#/detailjadwalkunjungan/212
//angular/partial/salesman/detailcustomer.html
myAppModule.controller("DetailJadwalKunjunganController", ["$rootScope","$scope", "$location","$http","auth","$window","$routeParams","NgMap","LocationService","$cordovaBarcodeScanner","$cordovaCamera","$cordovaCapture","apiService","singleapiService","ngToast","$mdDialog","$filter","sweet","ModalService","SummaryService","ProductService","CheckInService","CheckOutService","InventoryService","JadwalKunjunganService","GambarService","ExpiredService","$timeout","resolveconfigradiussqlite","LastVisitCustomerService","SalesAktifitas","$cordovaSQLite","resolveobjectbarangsqlite","resolvesot2type","resolveagendabyidserver","SOT2Services","ConfigradiusService","ExpiredSqliteServices","LamaKunjunganSqliteServices","$interval",
function ($rootScope,$scope, $location, $http,auth,$window,$routeParams,NgMap,LocationService,$cordovaBarcodeScanner,$cordovaCamera,$cordovaCapture,apiService,singleapiService,ngToast,$mdDialog,$filter,sweet,ModalService,SummaryService,ProductService,CheckInService,CheckOutService,InventoryService,JadwalKunjunganService,GambarService,ExpiredService,$timeout,resolveconfigradiussqlite,LastVisitCustomerService,SalesAktifitas,$cordovaSQLite,resolveobjectbarangsqlite,resolvesot2type,resolveagendabyidserver,SOT2Services,ConfigradiusService,ExpiredSqliteServices,LamaKunjunganSqliteServices,$interval) 
{
    var url = $rootScope.linkurl;
    if(resolveconfigradiussqlite)
    {
        if(resolveconfigradiussqlite.length > 0)
        {
            // var sortedConfigRadius = _.sortBy( resolveconfigradiussqlite, 'valueradius' ).reverse();
            // $scope.configjarak = sortedConfigRadius[0].valueradius;
            angular.forEach(resolveconfigradiussqlite,function(value,key)
            {
                if(value.note == 'CHECKIN')
                {
                    $scope.configjarak = value.valueradius;
                }
                else if(value.note == 'RENTANGKUNJUNGAN')
                {
                    $scope.configrentangkunjungan = value.valueradius;
                }
            });
        }
        else
        {
            ConfigradiusService.getConfigRadiusFromServer()
            .then (function (response)
            {
                // var sortedConfigRadius = _.sortBy(response, 'valueradius' ).reverse();
                // $scope.configjarak = sortedConfigRadius[0].valueradius;
                angular.forEach(response,function(value,key)
                {
                    if(value.note == 'CHECKIN')
                    {
                        $scope.configjarak = value.valueradius;
                    }
                    else if(value.note == 'RENTANGKUNJUNGAN')
                    {
                        $scope.configrentangkunjungan = value.valueradius;
                    }
                });
            },
            function (error)
            {
                alert("error");
            });          
        }  
    }
    
    var statusaction={};
    statusaction.bgcolor="bg-aqua";
    statusaction.icon="fa fa-close bg-aqua";
    statusaction.show = false;

    $scope.statusbarangexpired      = statusaction;
    $scope.statusstartpicture       = statusaction;
    $scope.statusendpicture         = statusaction;
    $scope.statusmessageskunjungan  = statusaction;

    $scope.userInfo = auth;
    $scope.logout = function () 
    { 
        $scope.userInfo = null;
        $window.sessionStorage.clear();
        window.location.href = "index.html";
    }

    var url = $rootScope.linkurl;



    var tanggalsekarang         = $filter('date')(new Date(),'yyyy-MM-dd');
    var tanggalinventory        = $filter('date')(new Date(),'yyyy-MM-dd');

    $scope.zoomvalue = 17;
    var geocoder = new google.maps.Geocoder;

    var options = {maximumAge: 3000,timeout: 5000, enableHighAccuracy: false};
    navigator.geolocation.getCurrentPosition(function (result) 
    {
        $scope.googlemaplat       = result.coords.latitude;
        $scope.googlemaplong      = result.coords.longitude;
    },
    function(err)
    {
        alert("GPS Tidak Hidup.Hidupkan GPS Untuk Menikmati Fitur Ini");
    },options);


    $scope.CUST_MAP_LAT                 = resolveagendabyidserver.MAP_LAT;
    $scope.CUST_MAP_LNG                 = resolveagendabyidserver.MAP_LNG;
    $scope.namacustomerdiview           = resolveagendabyidserver.CUST_NM;

    var ID_DETAIL                       = resolveagendabyidserver.ID_SERVER;
    var DEFAULT_CUST_LONG               = resolveagendabyidserver.MAP_LNG;      //Posisi Actual Customer Dari Master
    var DEFAULT_CUST_LAT                = resolveagendabyidserver.MAP_LAT;      //Posisi Actual Customer Dari Master
    var PLAN_TGL_KUNJUNGAN              = resolveagendabyidserver.TGL;
    var CUST_ID                         = resolveagendabyidserver.CUST_ID;
    var ID_GROUP                        = resolveagendabyidserver.SCDL_GROUP;

    var longitudecustomer               = DEFAULT_CUST_LONG;
    var latitudecustomer                = DEFAULT_CUST_LAT;

    var jarak = $rootScope.jaraklokasi($scope.googlemaplong,$scope.googlemaplat,longitudecustomer,latitudecustomer);
    // ####################GET FROM SQLITE LAMA KUNJUNGAN
    LamaKunjunganSqliteServices.getLamaKunjungan(ID_DETAIL)
    .then (function (response)
    {
        alert("Sukses Load Lama Kunjungan");
        var x                   = response[0].WAKTU_MASUK;
        var y                   = $filter('date')(response[0].WAKTU_KELUAR,'yyyy-MM-dd HH:mm:ss');
        var waktukeluar         = new Date(y);
        var tahun = waktukeluar.getFullYear();
        var bulan = waktukeluar.getMonth();
        var tanggal = waktukeluar.getDate();
        var jam		= waktukeluar.getHours();
        var menit	= waktukeluar.getMinutes();
        var detik	= waktukeluar.getSeconds();
 
        var future = new Date(tahun,bulan,tanggal,jam,menit,detik);
        console.log(future);
        var stopinterval = $interval(function () 
        {
            var diff;
            diff = Math.floor((future.getTime() - new Date().getTime()) / 1000);
            $scope.countdowns = $rootScope.convertwaktu(diff);
            if(diff < 1)
            {
                $scope.stopFight();
                alert("Waktu Kunjungan Habis");
            }
        }, 1000);
        $scope.stopFight = function() 
        {
            if (angular.isDefined(stopinterval)) 
            {
                $interval.cancel(stopinterval);
                stopinterval = undefined;
            }
        };
    },
    function (error)
    {
        alert("Gagal Mendapatkan Lama Kunjungan Ke Database");
    });    

    
    
    //#####################################################################################################
    // CHECK-IN FUNCTION
    //#####################################################################################################
    $scope.checkin = function()
    {
        var detail = {};
        var checkintime         = $filter('date')(new Date(),'yyyy-MM-dd HH:mm:ss');
        detail.LAT              = $scope.googlemaplat;
        detail.LAG              = $scope.googlemaplong;
        detail.RADIUS           = jarak;
        detail.CHECKIN_TIME     = checkintime;
        detail.CREATE_BY        = auth.id;
        detail.CREATE_AT        = checkintime;
        detail.STATUS           = 1;

        CheckInService.setCheckinAction(ID_DETAIL,detail)
        .then(function(data)
        {
            ngToast.create('Anda Berhasil Check In');
            
            var statuskunjungan = {};
            statuskunjungan.ID_DETAIL               = ID_DETAIL;
            statuskunjungan.TGL                     = PLAN_TGL_KUNJUNGAN;
            statuskunjungan.USER_ID                 = auth.id;
            statuskunjungan.CUST_ID                 = CUST_ID;
            statuskunjungan.CHECK_IN                = 1;

            CheckInService.updateCheckinStatus(ID_DETAIL,statuskunjungan)
            .then(function(data)
            {
                $scope.idstatuskunjunganresponse;
                if(data.StatusAda == "SudahAda")
                {
                   $scope.idstatuskunjunganresponse = data.StatusKunjungan[0].ID; 
                }
                else if(data.StatusAda == "BelumAda")
                {
                   $scope.idstatuskunjunganresponse = data.ID; 
                }
            },
            function (error)
            {
                alert("Gagal Update Status Check In Ke Server");
            });
        },
        function (error)
        {
            alert("Gagal Set Check In Ke Server");
            
        });

        var updateCHECKIN_TIME      = checkintime;
        var updateSTSCHECK_IN       = 1;
        var updateLAG               = $scope.googlemaplong;
        var updateLAT               = $scope.googlemaplat;

        var queryupdateagenda = 'UPDATE Agenda SET CHECKIN_TIME = ?, STSCHECK_IN = ?, LAG = ?, LAT = ? WHERE ID_SERVER = ?';
        $cordovaSQLite.execute($rootScope.db, queryupdateagenda, [updateCHECKIN_TIME,updateSTSCHECK_IN,updateLAG,updateLAT,ID_DETAIL])
        .then(function(result) 
        {
            console.log("Terimakasih. Agenda Check In Berhasil Di Update Di Local");
        },
        function(error) 
        {
            alert("Update Agenda Check In Gagal Di Update Di Local: " + error.message);
        });           
    };
    
    $timeout(function()
    {
        $scope.checkin();
    },5000);

    // ####################################################################################################
    // CHECK STATUS GAMBAR START GAMBAR END DENGAN PRODUCT EXPIRED
    // ####################################################################################################
    $scope.checkstatusgambarstartendexpired = function()
    {
        if (resolveagendabyidserver) 
        {
            var startpicturestatus          = resolveagendabyidserver.STSSTART_PIC;
            var endpicturestatus            = resolveagendabyidserver.STSEND_PIC;
            var inventoryexpiredstatus      = resolveagendabyidserver.STSINVENTORY_EXPIRED;

            $scope.statusstartpicture       = $rootScope.cekstatusbarang(startpicturestatus);
            $scope.statusendpicture         = $rootScope.cekstatusbarang(endpicturestatus);
            $scope.statusbarangexpired      = $rootScope.cekstatusbarang(inventoryexpiredstatus);
        }
    }
    $scope.checkstatusgambarstartendexpired();
    // ####################################################################################################
    // MENU ACTION
    // ####################################################################################################
    SalesAktifitas.getSalesAktifitas(CUST_ID,PLAN_TGL_KUNJUNGAN,resolveobjectbarangsqlite,resolvesot2type)
    .then (function(response)
    {
        $scope.salesaktivitas = response;
        
    },
    function (error)
    {
        alert("Sales Aktifitas Error");
    });
    // ####################################################################################################
    // INVENTORY FUNCTION
    //#####################################################################################################
    $scope.updateinventoryqty = function(parentindex,barang,index,idinventorys)
    {
        var idinventory = idinventorys.SO_ID;
        var titledialog = idinventorys.DIALOG_TITLE;
        var sotype      = idinventorys.ID;

        var jarak = $rootScope.jaraklokasi($scope.googlemaplong,$scope.googlemaplat,$scope.CUST_MAP_LNG,$scope.CUST_MAP_LAT);
        if(jarak > $scope.configjarak)
        {
            alert("Di Luar Radius.");
            // sweetAlert("Oops...", "Di Luar Radius!", "error");
        }
        else
        { 
            namaproduct = barang.NM_BARANG;
            sweet.show(
            {
                title: titledialog,
                text: namaproduct,
                type: 'input',
                showCancelButton: true,
                closeOnConfirm: true,
                animation: false,
                inputPlaceholder: 'Quantity/PCS'
            }, 
            function(inputValue) 
            {
                if(/^\d+$/.test(inputValue))
                {
                    
                }
                else
                {
                    var bukannumber = false;
                }

                if (inputValue === false)
                {
                    return false;
                }

                if ( (inputValue === '') || (bukannumber === false ) )
                {
                    sweet.showInputError('Ini Harus Diisi Dan Harus Angka!');
                    return false;
                }
                
                else
                {
                    $scope.loadingcontent = true;
                    var detail={};
                    detail.SO_TYPE                  = idinventory; //5:INVENTORY_STOCK, 6:INVENTORY_SELLIN, 7:INVENTORY_SELLOUT, 8:INVENTORY_RETURN,9:INVENTORY_REQUEST
                    detail.TGL                      = PLAN_TGL_KUNJUNGAN;
                    detail.CUST_KD                  = CUST_ID;
                    detail.CUST_NM                  = resolveagendabyidserver.CUST_NM;
                    detail.KD_BARANG                = barang.KD_BARANG;
                    detail.NM_BARANG                = namaproduct;
                    detail.POS                      = 'ANDROID';
                    detail.USER_ID                  = auth.id;
                    if(inputValue == 0)
                    {
                        detail.SO_QTY                   = -1;
                    }
                    else
                    {
                       detail.SO_QTY                   = inputValue; 
                    }
                    detail.ID_GROUP                 = ID_GROUP;
                    detail.WAKTU_INPUT_INVENTORY    = $filter('date')(new Date(),'yyyy-MM-dd HH:mm:ss');

                    InventoryService.setInventoryAction(detail)
                    .then(function (result) 
                    {
                        sweet.show({
                                        title: 'Saved',
                                        type: 'success',
                                        timer: 2000,
                                        showConfirmButton: false
                                    });

                        var newISON_SERVER              = 1;
                        var newTGL                      = detail.TGL;
                        var newCUST_KD                  = detail.CUST_KD;
                        var newCUST_NM                  = detail.CUST_NM;
                        var newKD_BARANG                = detail.KD_BARANG;
                        var newNM_BARANG                = detail.NM_BARANG;
                        var newSO_QTY                   = detail.SO_QTY;
                        var newSO_TYPE                  = detail.SO_TYPE;
                        var newPOS                      = detail.POS;
                        var newUSER_ID                  = detail.USER_ID;
                        var newSTATUS                   = 1;
                        var newWAKTU_INPUT_INVENTORY    = detail.WAKTU_INPUT_INVENTORY;
                        var newID_GROUP                 = detail.ID_GROUP;
                        var newDIALOG_TITLE             = idinventorys.DIALOG_TITLE;

                        var queryinsertsot2 = 'INSERT INTO Sot2 (ISON_SERVER,TGL,CUST_KD,CUST_NM,KD_BARANG,NM_BARANG,SO_QTY,SO_TYPE,POS,USER_ID,STATUS,WAKTU_INPUT_INVENTORY,ID_GROUP,DIALOG_TITLE) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)';
                        $cordovaSQLite.execute($rootScope.db,queryinsertsot2,[newISON_SERVER,newTGL,newCUST_KD,newCUST_NM,newKD_BARANG,newNM_BARANG,newSO_QTY,newSO_TYPE,newPOS,newUSER_ID,newSTATUS,newWAKTU_INPUT_INVENTORY,newID_GROUP,newDIALOG_TITLE])
                        .then(function(result) 
                        {
                            console.log("SOT2 Berhasil Disimpan Di Local!");
                        }, 
                        function(error) 
                        {
                            alert("SOT2 Gagal Disimpan Ke Local: " + error.message);
                        });

                        $scope.salesaktivitas[parentindex].products.splice(index, 1);
                        if($scope.salesaktivitas[parentindex].products.length == 0)
                        {
                            var status={};
                            status.bgcolor="bg-green";
                            status.icon="fa fa-check bg-green";
                            status.show = false;

                            $scope.salesaktivitas[parentindex].status = status


                            var statuskunjungan = $rootScope.updatestatusinventoryquantity(idinventory);
                            InventoryService.updateInventoryStatus(ID_DETAIL,statuskunjungan)
                            .then(function(data)
                            {
                                ngToast.create('Status Inventory Berhasil Di Update');
                                $scope.loadingcontent = false;
                            },
                            function (error)
                            {
                                alert("Gagal Menyimpan Status Inventory Ke Server");
                                $scope.loadingcontent = false;
                            });

                            var queryupdateagenda = 'UPDATE Agenda SET STS' + titledialog + ' = ? WHERE ID_SERVER = ?';
                            $cordovaSQLite.execute($rootScope.db, queryupdateagenda, [1,ID_DETAIL])
                            .then(function(result) 
                            {
                                console.log("Terimakasih. Agenda Status " + titledialog + " Berhasil Di Update Di Local");
                            },
                            function(error) 
                            {
                                alert("Error. Agenda Status " + titledialog + " Gagal Di Update Di Local");
                            });
                        }

                        $scope.loadingcontent = false;
                    },
                    function (error)
                    {
                        alert("Gagal Menyimpan SOT2 Ke Server");
                        $scope.loadingcontent = false;
                    });
                    
                }
            });
        }     
    }
    //#####################################################################################################
    // START TAKE PICTURE FUNCTION
    //#####################################################################################################
    $scope.starttakeapicture = function()
    {
    	var jarak = $rootScope.jaraklokasi($scope.googlemaplong,$scope.googlemaplat,$scope.CUST_MAP_LNG,$scope.CUST_MAP_LAT);
        if(jarak > $scope.configjarak)
        {
            // sweetAlert("Oops...", "Kamu Sedang Tidak Di Dalam Radius!", "error");
            alert("Kamu Sedang Tidak Di Dalam Radius");
        }
        else
        {
            document.addEventListener("deviceready", function () 
            {
                var options = $rootScope.getCameraOptions();
                $cordovaCamera.getPicture(options)
                .then(function (imageData) 
                {
                    $scope.loadingcontent = true;
                    

                    var timeimagestart = $filter('date')(new Date(),'yyyy-MM-dd HH:mm:ss');
                    
                    var gambarkunjungan={};
                    gambarkunjungan.ID_DETAIL           = ID_DETAIL;
                    gambarkunjungan.IMG_NM_START        = "gambar start";
                    gambarkunjungan.IMG_DECODE_START    = imageData;
                    gambarkunjungan.TIME_START          = timeimagestart;
                    gambarkunjungan.STATUS              = 1;
                    gambarkunjungan.CREATE_BY           = auth.id;
                    gambarkunjungan.CUSTOMER_ID         = resolveagendabyidserver.CUST_ID;

                    GambarService.setGambarAction(ID_DETAIL,gambarkunjungan)
                    .then(function (data)
                    {
                        var statusstartpicture              = {};
                        statusstartpicture.bgcolor          = "bg-green";
                        statusstartpicture.icon             = "fa fa-check bg-green";
                        $scope.statusstartpicture = statusstartpicture;
                        ngToast.create('Gambar Telah Berhasil Di Update');
                        
                        var statuskunjungan = {};
                        statuskunjungan.START_PIC = 1;

                        GambarService.updateGambarStatus(ID_DETAIL,statuskunjungan)
                        .then(function (data)
                        {
                            console.log(data);
                        }, 
                        function(err) 
                        {
                            alert("Gagal Update Status Start Picture");
                        });

                        var updateSTSSTART_PIC  = 1;
                        var queryupdateagenda   = 'UPDATE Agenda SET STSSTART_PIC = ? WHERE ID_SERVER = ?';
                        $cordovaSQLite.execute($rootScope.db, queryupdateagenda, [updateSTSSTART_PIC,ID_DETAIL])
                        .then(function(result) 
                        {
                            console.log("Terimakasih. Agenda Start Pic Di Update Di Local");
                        },
                        function(error) 
                        {
                            alert("Agenda Start Pic Gagal Di Update Di Local: " + error.message);
                        });
                        $scope.loadingcontent = false;
                    }, 
                    function(err) 
                    {
                        alert("Gagal Menyimpan Start Picture Ke Server");
                        $scope.loadingcontent = false;
                    });
                }, 
                function(err) 
                {
                    // alert(err.message);
                    $scope.loadingcontent = false;
                });

            }, false);
        }
    }
    //#####################################################################################################
    // END TAKE PICTURE FUNCTION
    //#####################################################################################################
    $scope.endtakeapicture = function()
    {
        var jarak = $rootScope.jaraklokasi($scope.googlemaplong,$scope.googlemaplat,$scope.CUST_MAP_LNG,$scope.CUST_MAP_LAT);
        if(jarak > $scope.configjarak)
        {
            alert("Kamu Sedang Tidak Di Dalam Radius");
            // sweetAlert("Oops...", "Kamu Sedang Tidak Di Dalam Radius!", "error");
        }
        else
        {
            // MODE MOBILE DEVICE
            document.addEventListener("deviceready", function () 
            {
                var options = {
                    quality: 50,
                    destinationType: Camera.DestinationType.DATA_URL,
                    sourceType: Camera.PictureSourceType.CAMERA,
                    allowEdit: false,
                    encodingType: Camera.EncodingType.JPEG,
                    targetWidth: 500,
                    targetHeight: 500,
                    popoverOptions: CameraPopoverOptions,
                    saveToPhotoAlbum: false,
                    correctOrientation:true
                  };
                  
                $cordovaCamera.getPicture(options)
                .then(function(imageData) 
                {
                    $scope.loadingcontent = true;
                    var timeimageend = $filter('date')(new Date(),'yyyy-MM-dd HH:mm:ss');
                    var gambarkunjungan={};

                    gambarkunjungan.IMG_NM_END      = "gambar end";
                    gambarkunjungan.IMG_DECODE_END  = imageData;
                    gambarkunjungan.TIME_END        = timeimageend;
                    gambarkunjungan.ID_DETAIL       = ID_DETAIL;
                    gambarkunjungan.UPDATE_BY       = auth.id;


                    GambarService.setEndGambarAction(ID_DETAIL,gambarkunjungan)
                    .then(function (data)
                    {
                        ngToast.create('Gambar Telah Berhasil Di Update');
                        var statusendpicture                = {};
                        statusendpicture.bgcolor            = "bg-green";
                        statusendpicture.icon               = "fa fa-check bg-green";
                        $scope.statusendpicture             = statusendpicture;

                        var statuskunjungan = {};
                        statuskunjungan.END_PIC = 1;

                        GambarService.updateGambarStatus(ID_DETAIL,statuskunjungan)
                        .then(function (data)
                        {
                            console.log(data);
                        }, 
                        function(err) 
                        {
                            alert("Gagal Update Status End Picture Ke Server");
                        });

                        var updateSTSEND_PIC  = 1;
                        var queryupdateagenda = 'UPDATE Agenda SET STSEND_PIC = ? WHERE ID_SERVER = ?';
                        $cordovaSQLite.execute($rootScope.db, queryupdateagenda, [updateSTSEND_PIC,ID_DETAIL])
                        .then(function(result) 
                        {
                            console.log("Terimakasih. Agenda End Pic Di Update Di Local");
                        },
                        function(error) 
                        {
                            alert("Agenda End Pic Gagal Di Update Di Local: " + error.message);
                        });

                        $scope.loadingcontent = false;
                    }, 
                    function(err) 
                    {
                        alert("Gagal Menyimpan End Picture Ke Server");
                        $scope.loadingcontent = false;
                    }); 
                }, 
                function(err) 
                {
                    // alert(err.message);
                    $scope.loadingcontent = false;
                });
            }, false);
        }
    }
    //#####################################################################################################
    // CHECK-OUT FUNCTION
    //#####################################################################################################
    // $scope.checkout = function(waktupaksakeluar)
    $scope.checkout = function()
    {
    	// if(waktupaksakeluar)
    	// {
     //    	$scope.loadingcontent = true;

     //        var checkouttime = waktupaksakeluar;
     //        var detail={};
     //        detail.CHECKOUT_LAT              = $scope.googlemaplat;
     //        detail.CHECKOUT_LAG              = $scope.googlemaplong;
     //        detail.CHECKOUT_TIME             = checkouttime;
     //        detail.UPDATE_BY                 = auth.id;

     //        CheckOutService.setCheckoutAction(ID_DETAIL,detail)
     //        .then(function(data)
     //        {
     //            var statuskunjungan = {};
     //            statuskunjungan.CHECK_OUT = 1;

     //            CheckOutService.updateCheckoutStatus($scope.idstatuskunjunganresponse,statuskunjungan)
     //            .then(function(data,status)
     //            {
     //                sweet.show({
     //                                title: 'Success!',
     //                                text: 'Kamu Berhasil Checkout',
     //                                timer: 1000,
     //                                showConfirmButton: false
     //                            });
                    
     //                $timeout($location.path('/agenda/'+ PLAN_TGL_KUNJUNGAN),1000);
     //            },
     //            function (error)
     //            {
     //                alert("Update Status Check Out Ke Server Gagal.Try Again");
     //            });
     //        },
     //        function (error)
     //        {
     //            alert("Update Check Out SCDL Detail Ke Server Gagal.Try Again");
     //        });

     //        var updateCHECKOUT_TIME  = checkouttime;
     //        var updateSTSCHECK_OUT      = 1;

     //        var queryupdateagenda = 'UPDATE Agenda SET CHECKOUT_TIME = ?, STSCHECK_OUT = ? WHERE ID_SERVER = ?';
     //        $cordovaSQLite.execute($rootScope.db, queryupdateagenda, [updateCHECKOUT_TIME,updateSTSCHECK_OUT,ID_DETAIL])
     //        .then(function(result) 
     //        {
     //            console.log("Terimakasih. Agenda Check Out Berhasil Di Update Di Local");
     //        },
     //        function(error) 
     //        {
     //            alert("Update Agenda Check Out Gagal Di Update Di Local: " + error.message);
     //        });
    	// }
       
    	sweet.show({
            title: 'Checkout',
            text: 'Apakah Kamu Yakin Untuk Checkout?',
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#DD6B55',
            confirmButtonText: 'Yes',
            closeOnConfirm: true
        }, 
        function() 
        {
            $scope.loadingcontent = true;

            var checkouttime = $filter('date')(new Date(),'yyyy-MM-dd HH:mm:ss');
            var detail={};
            detail.CHECKOUT_LAT              = $scope.googlemaplat;
            detail.CHECKOUT_LAG              = $scope.googlemaplong;
            detail.CHECKOUT_TIME             = checkouttime;
            detail.UPDATE_BY                 = auth.id;

            CheckOutService.setCheckoutAction(ID_DETAIL,detail)
            .then(function(data)
            {
                var statuskunjungan = {};
                statuskunjungan.CHECK_OUT = 1;

                CheckOutService.updateCheckoutStatus($scope.idstatuskunjunganresponse,statuskunjungan)
                .then(function(data,status)
                {
                    sweet.show({
                                    title: 'Success!',
                                    text: 'Kamu Berhasil Checkout',
                                    timer: 1000,
                                    showConfirmButton: false
                                });
                    
                    $timeout($location.path('/agenda/'+ PLAN_TGL_KUNJUNGAN),1000);
                },
                function (error)
                {
                    alert("Update Status Check Out Ke Server Gagal.Try Again");
                });
            },
            function (error)
            {
                alert("Update Check Out SCDL Detail Ke Server Gagal.Try Again");
            });

            var updateCHECKOUT_TIME  = checkouttime;
            var updateSTSCHECK_OUT      = 1;

            var queryupdateagenda = 'UPDATE Agenda SET CHECKOUT_TIME = ?, STSCHECK_OUT = ? WHERE ID_SERVER = ?';
            $cordovaSQLite.execute($rootScope.db, queryupdateagenda, [updateCHECKOUT_TIME,updateSTSCHECK_OUT,ID_DETAIL])
            .then(function(result) 
            {
                console.log("Terimakasih. Agenda Check Out Berhasil Di Update Di Local");
            },
            function(error) 
            {
                alert("Update Agenda Check Out Gagal Di Update Di Local: " + error.message);
            }); 
        });

    };
    //#####################################################################################################
    // NOTE KUNJUNGAN FUNCTION
    //#####################################################################################################
    SalesAktifitas.getMemoSalesAktifitas(ID_DETAIL)
    .then (function (responsesalesmemo)
    {
        if(angular.isArray(responsesalesmemo))
        {
            $scope.messageskunjungandisabled = false;
        }
        else
        {
            $scope.salesmanmemo                 = responsesalesmemo;
            $scope.statusmessageskunjungan      = responsesalesmemo;
            $scope.messageskunjungandisabled    = responsesalesmemo.messageskunjungandisabled;
        }
    },
    function (error)
    {
        alert("Error Mendapatkan Sales Memo Dari Server");
        $scope.messageskunjungandisabled = false;
    });

    $scope.submitFormSalesMemo = function(formsalesmanmemo)
    {
        $scope.loadingcontent           = true;
        var memodibuatpada              = $filter('date')(new Date(),'yyyy-MM-dd HH:mm:ss');

        var salesmanmemo = {};
        salesmanmemo.ID_DETAIL          = resolveagendabyidserver.ID_SERVER;
        salesmanmemo.KD_CUSTOMER        = resolveagendabyidserver.CUST_ID;
        salesmanmemo.NM_CUSTOMER        = resolveagendabyidserver.CUST_NM;
        salesmanmemo.TGL                = $filter('date')(new Date(),'yyyy-MM-dd');


        salesmanmemo.ISI_MESSAGES       = formsalesmanmemo.ISI_MESSAGES
        salesmanmemo.ID_USER            = auth.id;
        salesmanmemo.NM_USER            = auth.username;
        salesmanmemo.STATUS_MESSAGES    = "URGENT";
        salesmanmemo.CREATE_AT          = memodibuatpada;
        salesmanmemo.CREATE_BY          = auth.id;

        SalesAktifitas.setMemoSalesAktifitas(salesmanmemo)
        .then (function (responsesalesmemo)
        {
            $scope.statusmessageskunjungan      = responsesalesmemo;
            $scope.messageskunjungandisabled    = responsesalesmemo.messageskunjungandisabled;
            $scope.loadingcontent = false;
            ngToast.create('Memo Kunjungan Berhasil Di Save');
        },
        function (error)
        {
            alert("Memo Status Kunjungan Gagal Di Save Di Server");
            $scope.loadingcontent = false;
        });
    }
    // ####################################################################################################
    // GET DATA BARANG UNTUK EXPIRED FUNCTION
    //#####################################################################################################
    ExpiredSqliteServices.getSqliteExpired(ID_DETAIL)
    .then (function (databarangexpired)
    {
        var arrayobjectdatabarang = resolveobjectbarangsqlite;
        var arrayhanyakodebarang = [];

        angular.forEach(arrayobjectdatabarang, function(value, key)
        {
            arrayhanyakodebarang.push(value.KD_BARANG);
        });

        var x           = $rootScope.diffbarang(arrayhanyakodebarang,databarangexpired);

        $scope.barangexpired   = [];

        angular.forEach(x, function(value, key)
        {
            var existingFilter = _.findWhere(arrayobjectdatabarang, { KD_BARANG: value.KD_BARANG });
            $scope.barangexpired.push(existingFilter);
        });
    });
    //#####################################################################################################
    // EXPIRED FUNCTION
    //#####################################################################################################
    $scope.showmodal = function(barang,index) 
    {
        var jarak = $rootScope.jaraklokasi($scope.googlemaplong,$scope.googlemaplat,$scope.CUST_MAP_LNG,$scope.CUST_MAP_LAT);
        if(jarak > $scope.configjarak)
        {
            alert("Kamu Sedang Tidak Di Dalam Radius");
            // sweetAlert("Oops...", "Kamu Sedang Tidak Di Dalam Radius!", "error");
        }
        else
        {
            ModalService
            .showModal(
            {
              templateUrl: "angular/partial/salesman/complexmodal.html",
              controller: "ComplexController",
              inputs: 
              {
                title: barang.NM_BARANG
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
                    var kodebarang     = barang.KD_BARANG;

                    for(var i = 0; i < result.list.length ; i ++)
                    {
                        var tanggalexpired = result.list[i].tanggaled;
                        var expiredqty     = result.list[i].expiredqty;
                        var prioritas      = result.list[i].prioritas;

                        if(tanggalexpired != null && expiredqty != null)
                        {
                            var tglexpd = $filter('date')(tanggalexpired,'yyyy-MM-dd'); 

                            var detailexpired = {};
                            detailexpired.ID_PRIORITASED    = prioritas;
                            detailexpired.ID_DETAIL         = ID_DETAIL;
                            detailexpired.CUST_ID           = CUST_ID;
                            detailexpired.BRG_ID            = kodebarang;
                            detailexpired.USER_ID           = auth.id;
                            detailexpired.TGL_KJG           = PLAN_TGL_KUNJUNGAN;
                            detailexpired.QTY               = expiredqty;
                            detailexpired.DATE_EXPIRED      = tglexpd;
                            detailexpired.CREATE_BY         = auth.id;

                            var expiredproduct              = $rootScope.seriliazeobject(detailexpired);
                            var serialized                  = expiredproduct.serialized;
                            var config                      = expiredproduct.config;

                            $http.post(url + "/expiredproducts",serialized,config)
                            .success(function(data,status,headers,config) 
                            {
                                detailexpired.ID    = data.ID;
                                ExpiredSqliteServices.setSqliteExpired(detailexpired)
                                .then (function (resultinsert)
                                {
                                    console.log(resultinsert);
                                },
                                function (error)
                                {
                                    alert("Gagal Menimpan Data Expired Ke Local");
                                });
                                
                            })
                            .finally(function()
                            {
                                $scope.loadingcontent = false;  
                            });

                             
                        }
                    }
                    ngToast.create("Expired Product Telah Diupdate");

                    $scope.barangexpired.splice(index,1);
                    if($scope.barangexpired.length == 0)
                    {
                        var updateSTSINVENTORY_EXPIRED      = 1;
                        var queryupdateagenda = 'UPDATE Agenda SET STSINVENTORY_EXPIRED = ? WHERE ID_SERVER = ?';
                        $cordovaSQLite.execute($rootScope.db, queryupdateagenda, [updateSTSINVENTORY_EXPIRED,ID_DETAIL])
                        .then(function(result) 
                        {
                            console.log("Terimakasih. Inventory Expired Berhasil Di Update Di Local");
                        },
                        function(error) 
                        {
                            alert("Inventory Expired Gagal Di Update Di Local: " + error.message);
                        });

                        var statusbarangexpired     = {};
                        statusbarangexpired.bgcolor = "bg-green";
                        statusbarangexpired.icon    = "fa fa-check bg-green";
                        statusbarangexpired.show    = false;

                        $scope.statusbarangexpired = statusbarangexpired;

                        var idstatuskunjungan   = $rootScope.findidstatuskunjunganbyiddetail(ID_DETAIL);
                        var statuskunjungan = {};
                        statuskunjungan.INVENTORY_EXPIRED = 1;

                        var resultstatus            = $rootScope.seriliazeobject(statuskunjungan);
                        var serialized              = resultstatus.serialized;
                        var config                  = resultstatus.config;

                        $http.put(url + "/statuskunjungans/"+ idstatuskunjungan,serialized,config)
                        .success(function(data,status, headers, config) 
                        {
                            ngToast.create('Status Inventory Expired Berhasil Di Update Di Server');
                        })
                        .finally(function()
                        {
                            $scope.loadingcontent = false;  
                        }); 
                    }
                });
            });
        }    
    };
    // ####################################################################################################
    // SUMMARY FUNCTION
    //#####################################################################################################
    //Local Using Sqlite
    $scope.summarycustomer = function()
    {
        $scope.loadingcontent  = true;
        SOT2Services.getSOT2SummaryPerCustomer(PLAN_TGL_KUNJUNGAN,auth.id,resolveobjectbarangsqlite,resolvesot2type,CUST_ID)
        .then(function(data)
        {
            $scope.summarysqlite = data;
            $timeout(function()
            {
                $scope.loadingcontent  = false;
            },5000);
        },
        function (err)
        {
            alert(err);
            $scope.loadingcontent  = false;
        });
    };
    
    $scope.lastvisitsummary = function()
    {
        $scope.loadingcontent = true;
        LastVisitCustomerService.LastVisitSummaryCustomer(CUST_ID,PLAN_TGL_KUNJUNGAN)
        .then(function (data)
        {
            $scope.Lastvisitsummary = data;
            $scope.loadingcontent = false;
        });
    };
}]);

myAppModule.controller('ComplexController', ['$rootScope','$scope', '$http','$element', 'title', 'close',"$filter",
function($rootScope,$scope, $http,$element, title, close,$filter) 
{

   $scope.title = title;
    var myDate = new Date();
    var previousMonth = new Date(myDate);
    previousMonth.setMonth(myDate.getMonth()-1);

    var nextMonth1 = new Date(myDate);
    nextMonth1.setMonth(myDate.getMonth()+1);

    var nextMonth2 = new Date(myDate);
    nextMonth2.setMonth(myDate.getMonth()+2);
    var nextMonth3 = new Date(myDate);
    nextMonth3.setMonth(myDate.getMonth()+3);

    var url = $rootScope.linkurl;
    $http.get(url + "/expiredpriorities/search?STATUS=1")
    .success(function(data,status, headers, config) 
    {
        $scope.list = [];
        angular.forEach(data.ExpiredPrioritas, function(value, key) 
        {
            var jangkawaktu = value.JANGKA_WAKTU;
            var nextMonth = new Date(myDate);
            nextMonth.setMonth(myDate.getMonth()+ jangkawaktu);
            var result = {};
            result.tanggaled = nextMonth;
            result.expiredqty = null;
            result.prioritas  = jangkawaktu;

            $scope.list.push(result);
             // {tanggaled:nextMonth1, expiredqty:null, prioritas:1},{tanggaled:nextMonth2, expiredqty:null,prioritas:2},{tanggaled:nextMonth3, expiredqty:null,prioritas:3} ];
        });
    });

  // var tanggaled = $filter('date')(nextMonth,'yyyy-MM-dd');
  // $scope.list = [ {tanggaled:nextMonth1, expiredqty:null, prioritas:1},{tanggaled:nextMonth2, expiredqty:null,prioritas:2},{tanggaled:nextMonth3, expiredqty:null,prioritas:3} ];
  
  $scope.close = function() 
  {
        close({list:$scope.list,title:$scope.title}, 500); // close, but give 500ms for bootstrap to animate
  };

  $scope.cancel = function() 
  {
    $element.modal('hide');
  };

  $scope.qtychange = function()
  {
    alert("radumta");
  }
}]);