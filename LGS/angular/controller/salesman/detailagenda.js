myAppModule.controller("DetailAgendaController", ["$rootScope","$scope", "$location","$http","auth","$window","SummaryService","NgMap","LocationService","$filter","sweet","$routeParams","$timeout","JadwalKunjunganService","singleapiService","ConfigradiusSqlite","LastVisitService","$cordovaSQLite","AgendaSqliteServices","resolvestatusabsensi","resolveobjectbarangsqlite","resolvesot2type","SOT2Services","LamaKunjunganSqliteServices","ModalService","configurationService",
function ($rootScope,$scope, $location, $http,auth,$window,SummaryService,NgMap,LocationService,$filter,sweet,$routeParams,$timeout,JadwalKunjunganService,singleapiService,ConfigradiusSqlite,LastVisitService,$cordovaSQLite,AgendaSqliteServices,resolvestatusabsensi,resolveobjectbarangsqlite,resolvesot2type,SOT2Services,LamaKunjunganSqliteServices,ModalService,configurationService)
{
    $scope.userInfo = auth;
    $scope.loadingcontent  = true;
    var idsalesman = auth.id;

    ConfigradiusSqlite.GetConfigradiusSqlite()
    .then(function (responselocal)
    {
        if(angular.isArray(responselocal) && responselocal.length > 0 )
        {
            angular.forEach(responselocal,function(value,key)
            {
                if(value.note == 'CHECKIN')
                {
                    $scope.configjarak = value.valueradius;
                }
                if(value.note == 'RENTANGKUNJUNGAN')
                {
                    $scope.configrentangkunjungan = value.valueradius;
                    console.log($scope.configrentangkunjungan);
                }
            });
        }
        else
        {
            ConfigradiusSqlite.GetConfigRadiusFromServer()
            .then(function(responseserver)
            {
                if(angular.isArray(responseserver) && responseserver.length > 0 )
                {
                    angular.forEach(responseserver,function(value,key)
                    {
                        if(value.note == 'CHECKIN')
                        {
                            $scope.configjarak = value.valueradius;
                        }
                        if(value.note == 'RENTANGKUNJUNGAN')
                        {
                            $scope.configrentangkunjungan = value.valueradius;
                            console.log($scope.configrentangkunjungan);
                        }
                    });
                }
            });
        }
    });

    $scope.data = 
    {
      selectedIndex: 0,
      secondLocked:  true,
      secondLabel:   "Item Two",
      bottom:        false
    };

    $scope.logout = function () 
    { 
        $scope.userInfo = null;
        $window.sessionStorage.clear();
        window.location.href = "index.html";
    }
    var tanggalsekarang = $filter('date')(new Date(),'yyyy-MM-dd');
    var tanggalplan     = $filter('date')($routeParams.idtanggal,'yyyy-MM-dd');

    if(tanggalsekarang == tanggalplan)
    {
        $scope.activeagendatoday = "active";
    }
    else
    {
        $scope.activehistory = "active";
    }
    
    var options = {maximumAge:3000,timeout:60000, enableHighAccuracy: false};
    var geocoder = new google.maps.Geocoder;
    LocationService.GetGpsLocation(options)
    .then(function(data)
    {
        $scope.gpslat   = data.latitude;
        $scope.gpslong  = data.longitude;
    });


    var queryagendatoday = "SELECT * FROM Agenda WHERE TGL = ? AND USER_ID = ?";
    $cordovaSQLite.execute($rootScope.db, queryagendatoday, [tanggalplan, auth.id])
    .then(function(result) 
    {
        if (result.rows.length > 0) 
        {
            $scope.customers = [];
            var l = result.rows.length;
            for (var i=0; i < l; i++) 
            {
                var customer = {};
                customer.ID                         = result.rows.item(i).ID_SERVER;
                customer.CUST_ID                    = result.rows.item(i).CUST_ID;
                customer.CUST_NM                    = result.rows.item(i).CUST_NM;
                customer.MAP_LAT                    = result.rows.item(i).MAP_LAT;
                customer.MAP_LNG                    = result.rows.item(i).MAP_LNG;
                customer.TANGGAL                    = result.rows.item(i).TGL;
                customer.CHECKIN_TIME               = $filter('date')(result.rows.item(i).CHECKIN_TIME,'dd-MM-yyyy HH:mm:ss');
                customer.CHECKOUT_TIME              = $filter('date')(result.rows.item(i).CHECKOUT_TIME,'dd-MM-yyyy HH:mm:ss');

                customer.STSSTART_PIC               = result.rows.item(i).STSSTART_PIC;
                customer.STSEND_PIC                 = result.rows.item(i).STSEND_PIC;
                customer.STSCHECK_IN                = result.rows.item(i).STSCHECK_IN;
                customer.STSCHECK_OUT               = result.rows.item(i).STSCHECK_OUT;
                customer.STSINVENTORY_STOCK         = result.rows.item(i).STSINVENTORY_STOCK;
                customer.STSINVENTORY_SELLIN        = result.rows.item(i).STSINVENTORY_SELLIN;
                customer.STSINVENTORY_SELLOUT       = result.rows.item(i).STSINVENTORY_SELLOUT;
                customer.STSINVENTORY_EXPIRED       = result.rows.item(i).STSINVENTORY_EXPIRED;
                customer.STSINVENTORY_REQUEST       = result.rows.item(i).STSINVENTORY_REQUEST;
                customer.STSINVENTORY_RETURN        = result.rows.item(i).STSINVENTORY_RETURN;
                
                if(customer.STSCHECK_IN  == 0 || customer.STSCHECK_IN  == null)
                {
                    customer.imagecheckout = "asset/admin/dist/img/normal.jpg";
                }
                else
                {
                    if((customer.STSCHECK_OUT  == 1)||(customer.STSCHECK_OUT  == "1"))
                    {
                        customer.imagecheckout = "asset/admin/dist/img/customer.jpg";
                    }
                    else
                    {
                        customer.imagecheckout = "asset/admin/dist/img/customerlogo.jpg";
                    } 
                }

                var longitude1      = $scope.gpslat;
                var latitude1       = $scope.gpslong;

                var longitude2      = undefined;
                var latitude2       = undefined;
                if(customer.MAP_LNG != null && customer.MAP_LAT != null)
                {
                    longitude2      = customer.MAP_LNG;
                    latitude2       = customer.MAP_LAT;
                }
                var jarak           = $rootScope.jaraklokasi(longitude1,latitude1,longitude2,latitude2);
                //var roundjarak      = $filter('setDecimal')(jarak,0);
                if(jarak < 1000)
                {
                    customer.JARAKMETER = $filter('setDecimal')(jarak,0) + " meter";
                }
                else
                {
                    customer.JARAKMETER = $filter('setDecimal')(jarak/1000,1) + " km";
                }
                customer.JARAK            = $filter('setDecimal')(jarak/1000,0);


                var totalstatus = customer.STSSTART_PIC + customer.STSEND_PIC + customer.STSCHECK_IN + customer.STSCHECK_OUT + customer.STSINVENTORY_STOCK + customer.STSINVENTORY_SELLIN + customer.STSINVENTORY_SELLOUT + customer.STSINVENTORY_EXPIRED + customer.STSINVENTORY_REQUEST + customer.STSINVENTORY_RETURN;
                var persen = (totalstatus * 100)/10;
                customer.persen = persen;
                if(persen == 100)
                {
                    customer.wanted = true;
                }
                $scope.customers.push(customer);
            }
        }
        else
        {
            JadwalKunjunganService.GetGroupCustomerByTanggalPlan(auth,tanggalplan)
            .then(function(response)
            {
                if(response.length == 0)
                {
                    alert("Belum Ada Agenda Hari Ini");
                    $location.path('/history');
                }
                else
                {
                    var idgroupcustomer         = response.SCDL_GROUP;
                    JadwalKunjunganService.GetSingleDetailKunjunganProsedur(idsalesman,idgroupcustomer,tanggalplan,$scope.gpslong,$scope.gpslat)
                    .then(function (responseagendatoday) 
                    {
                        if(responseagendatoday.length > 0)
                        {
                            angular.forEach(responseagendatoday, function(value, key)
                            {
                                var newID_SERVER                = value.ID;
                                var newTGL                      = tanggalplan;
                                var newUSER_ID                  = auth.id;
                                var newCUST_ID                  = value.CUST_ID;
                                var newCUST_NM                  = value.CUST_NM;
                                var newLAG                      = $scope.gpslat;  //GPS LAT LOCATION
                                var newLAT                      = $scope.gpslong; //GPS LNG LOCATION
                                var newMAP_LAT                  = value.MAP_LAT; //ACTUAL LAT CUSTOMER DARI MASTER
                                var newMAP_LNG                  = value.MAP_LNG; //ACTUAL LAG CUSTOMER DARI MASTER
                                var newCHECKIN_TIME             = value.CHECKIN_TIME;
                                var newCHECKOUT_TIME            = value.CHECKOUT_TIME;

                                var newSTSCHECK_IN              = value.STSCHECK_IN;
                                var newSTSCHECK_OUT             = value.STSCHECK_OUT;
                                var newSTSINVENTORY_EXPIRED     = value.STSINVENTORY_EXPIRED;
                                var newSTSINVENTORY_SELLIN      = value.STSINVENTORY_SELLIN;
                                var newSTSINVENTORY_SELLOUT     = value.STSINVENTORY_SELLOUT;
                                var newSTSINVENTORY_STOCK       = value.STSINVENTORY_STOCK;
                                var newSTSINVENTORY_REQUEST     = value.STSINVENTORY_REQUEST;
                                var newSTSINVENTORY_RETURN      = value.STSINVENTORY_RETURN;


                                var newSTSSTART_PIC             = value.STSSTART_PIC;
                                var newSTSEND_PIC               = value.STSEND_PIC;
                                var newSCDL_GROUP               = idgroupcustomer;
                                var newSTSISON_SERVER           = 1;

                                var queryinsertagendatoday = 'INSERT INTO Agenda (ID_SERVER,TGL,USER_ID,CUST_ID,CUST_NM,LAG,LAT,MAP_LAT,MAP_LNG,CHECKIN_TIME,CHECKOUT_TIME,STSCHECK_IN,STSCHECK_OUT,STSINVENTORY_EXPIRED,STSINVENTORY_SELLIN,STSINVENTORY_SELLOUT,STSINVENTORY_STOCK,STSINVENTORY_REQUEST,STSINVENTORY_RETURN,STSSTART_PIC,STSEND_PIC,SCDL_GROUP,STSISON_SERVER) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)';
                                $cordovaSQLite.execute($rootScope.db,queryinsertagendatoday,[newID_SERVER,newTGL,newUSER_ID,newCUST_ID,newCUST_NM,newLAG,newLAT,newMAP_LAT,newMAP_LNG,newCHECKIN_TIME,newCHECKOUT_TIME,newSTSCHECK_IN,newSTSCHECK_OUT,newSTSINVENTORY_EXPIRED,newSTSINVENTORY_SELLIN,newSTSINVENTORY_SELLOUT,newSTSINVENTORY_STOCK,newSTSINVENTORY_REQUEST,newSTSINVENTORY_RETURN,newSTSSTART_PIC,newSTSEND_PIC,newSCDL_GROUP,newSTSISON_SERVER])
                                .then(function(result) 
                                {
                                    console.log("Customer Untuk Agenda Today Berhasil Disimpan Di Local!");
                                }, 
                                function(error) 
                                {
                                    alert("Customer Untuk Agenda Today Gagal Disimpan Ke Local: " + error.message);
                                });
                            });
                            $scope.customers        = responseagendatoday;
                            $scope.loadingcontent   = false;  
                        }
                        else
                        {
                            alert("Belum Ada Customer Di Server Yang Didaftarkan Untuk Group Ini");
                        }
                        
                    },
                    function (error)
                    {
                        var forcereload = confirm("Cors Agenda Error. Reload Again");
                        if (forcereload == true) 
                        {
                            $scope.loadingcontent   = true;
                            $timeout(function()
                            {
                                $window.location.reload();
                            },10000);
                        }
                        else
                        {
                            $scope.loadingcontent   = false;
                        }
                    });  
                }      
            },
            function (error)
            {
                alert("Gagal Mendapathari Data Agenda Today Dari Server");
            });
        }
        $scope.loadingcontent  = false; 
    },
    function(error) 
    {
        $scope.loadingcontent  = false;
        alert("Gagal Mendapatkan Data Dari Local Untuk Agenda Tanggal" + tanggalplan + ": " + error.message);
    });


    $scope.detailjadwalkunjungan = function(customer)
    {
        if(tanggalplan < tanggalsekarang)
        {
            alert("Tidak Bisa Lagi Check In");
        }
        else if(tanggalplan > tanggalsekarang)
        {
            alert("Belum Bisa Check In");
        }
        else if(tanggalplan == tanggalsekarang)
        {
            if(resolvestatusabsensi.statusabsensi == 0)
            {
                if(customer.STSCHECK_OUT == 1 || customer.STSCHECK_OUT == "1")
                {
                    alert("Kamu Sudah Check Out");
                }
                else
                { 
                    AgendaSqliteServices.getCheckinCheckoutStatus(tanggalplan,auth.id)
                    .then (function (response)
                    {
                        if(response.length == 0)
                        {
                            var lanjutcheckin = confirm("Yakin Check In Di Customer " + customer.CUST_NM +"?");
                            if (lanjutcheckin == true) 
                            {
                                var waktumasuk      = new Date();
                                var tahunmasuk      = $filter('date')(waktumasuk,'yyyy');
                                var bulanmasuk      = $filter('date')(waktumasuk,'MM');
                                var tanggalmasuk    = $filter('date')(waktumasuk,'dd');
                                var jammasuk        = $filter('date')(waktumasuk,'HH');
                                var menitmasuk      = $filter('date')(waktumasuk,'mm');

                                var rentangwaktu    = $scope.configrentangkunjungan;
                                var hitungmenit = parseInt(menitmasuk,10) + parseInt(rentangwaktu);
                                var hitungjam   = parseInt(jammasuk,10);
                                var waktukeluar = new Date(tahunmasuk,bulanmasuk - 1,tanggalmasuk,0,0,0);
                                if(hitungmenit / 60 > 1)
                                {
                                    var jamx        = hitungjam + 1;
                                    var menitx      = hitungmenit % 60;
                                    waktukeluar.setHours(jamx);
                                    waktukeluar.setMinutes(menitx);
                                }
                                else
                                {
                                    waktukeluar.setHours(hitungjam);
                                    waktukeluar.setMinutes(hitungmenit);
                                }
                                var newID_AGENDA    = customer.ID;
                                var newWAKTU_MASUK  = $filter('date')(waktumasuk,'yyyy-MM-dd HH:mm:ss');
                                var newWAKTU_KELUAR = $filter('date')(waktukeluar,'yyyy-MM-dd HH:mm:ss');
                                var isitable        = [newID_AGENDA,newWAKTU_MASUK,newWAKTU_KELUAR];
                                LamaKunjunganSqliteServices.setLamaKunjungan(isitable)
                                .then (function (response)
                                {
                                    $location.path('/detailjadwalkunjungan/' + customer.ID);
                                },
                                function (error)
                                {
                                    console.log("Gagal Menyimpan Lama Kunjungan Ke Database Local");
                                });   
                            }
                        }
                        else
                        {
                            if(response == customer.ID)
                            {
                                $location.path('/detailjadwalkunjungan/' + customer.ID);
                            }
                            else
                            {
                                alert("Double Check In Dilarang");
                            }   
                        }
                    },
                    function (error)
                    {
                        alert("Error Check In Check Out");
                    });   
                }  
            }
            else if(resolvestatusabsensi.statusabsensi == 1)
            {
                alert("Sudah Absen Keluar");
            }
            else
            {
                alert("Lakukan Absen Masuk Terlebih Dahulu");
            }    
        }
    } 

    $scope.summaryallsqlite = function()
    {
        $scope.loadingcontent  = true;
        SOT2Services.getSOT2SummaryAllCustomer(tanggalplan,auth.id,resolveobjectbarangsqlite,resolvesot2type)
        .then(function(data)
        {
            // Untuk Referensi Lihat di Backcrm 28-07-2016 OutCaseController
            $scope.combinations = data;
            
            var z = '';
            var totalinventory = '<td>TOTAL</td>';
            angular.forEach($scope.combinations[0].products, function(value,key)
            {
                var xxx = value;
                angular.forEach(xxx.penjualan, function(value,key)
                {
                    z = z + '<td align="center">' + value.DIALOG_TITLE + '</td>';
                    totalinventory = totalinventory + '<td align="center">' + value.TOTALQTY + '</td>';
                });
            });
            $scope.indonesia = z;
            $scope.loadingcontent  = false;
            $scope.totalinventory = totalinventory;
        },
        function (err)
        {
            alert("Gagal Mendapatkan Summary All Dari Local " + err);
            $scope.loadingcontent  = false;
        });
    };

    $scope.lastvisitsummary = function()
    {
        $scope.loadingcontent = true;
        JadwalKunjunganService.GetGroupCustomerByTanggalPlan(auth,tanggalplan)
        .then(function(data)
        {
            var idgroupcustomer         = data.SCDL_GROUP;
            LastVisitService.LastVisitSummaryAll(tanggalplan,idgroupcustomer)
            .then(function (result) 
            {
                $scope.sitereslv            = result.siteres;
                $scope.totalallslv          = result.totalalls;
                $scope.datapengunjung       = result.pengunjung;
                $scope.loadingcontent       = false;
            }, 
            function (err) 
            {          
                alert("Gagal Mendapatkan Last Visit Summary Dari Server " + err);
                $scope.loadingcontent  = false;
            });
        }, 
        function (err) 
        {          
            alert("Gagal Mendapatkan Group Customer Dari Server " + err);
            $scope.loadingcontent  = false;
        });
    };
}]);


