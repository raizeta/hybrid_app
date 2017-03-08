'use strict';
myAppModule.controller("ConfigurationController", ["$rootScope","$scope", "$location","$http","auth","$window","$filter","configurationService","$cordovaSQLite","ProductService","WhosyncService","OutCaseService","JadwalKunjunganService", 
function ($rootScope,$scope,$location,$http,auth,$window,$filter,configurationService,$cordovaSQLite,ProductService,WhosyncService,OutCaseService,JadwalKunjunganService) 
{   
    $scope.activeconfig  = "active";
    $scope.userInfo = auth;
	$scope.logout = function () 
    { 
        $scope.userInfo = null;
        $window.sessionStorage.clear();
        window.location.href = "index.html";
    }

    configurationService.getConfigRadius()
    .then (function (response)
    {
        angular.forEach(response,function(value,key)
        {
            if(value.note == 'SYNCPRODUCT')
            {
                $scope.showbuttonproduct = true;
            }
            if(value.note == 'SYNCSCDLHEADER')
            {
                $scope.showbuttonscdlheader = true;
            }
            if(value.note == 'SYNCAGENDA')
            {
                $scope.showbuttonagenda = true;
            }
            if(value.note == 'SYNCABSENSI')
            {
                $scope.showbuttonabsensi = true;
            }
            if(value.note == 'SYNCSOT2')
            {
                $scope.showbuttonsot2 = true;
            }
            if(value.note == 'SYNCSOTYPE')
            {
                $scope.showbuttonsotype = true;
            }
            if(value.note == 'SYNCOUTOFCASE')
            {
                $scope.showbuttonoutofcase = true;
            }
            if(value.note == 'SYCNCUSTOMERS')
            {
                $scope.showbuttonsynccustomers = true;
            }
        });
    },
    function (error)
    {
        alert("Configuration Dari Server Error");
    });

    var tanggalsekarang = $filter('date')(new Date(),'yyyy-MM-dd');
    var queryscdlheaderhariini = 'SELECT * FROM Scdlheader WHERE USER_ID = ? AND TGL1 = ?';
    document.addEventListener("deviceready", function () 
    {
        $cordovaSQLite.execute($rootScope.db, queryscdlheaderhariini, [auth.id,tanggalsekarang])
        .then(function(result) 
        {
            if (result.rows.length > 0) 
            {
                $scope.showbuttonoutofcase = false;
            }
            else
            {
                $scope.showbuttonoutofcase = true;
            }  
        });
    },false);

    JadwalKunjunganService.GetGroupCustomerByTanggalPlan(auth,tanggalsekarang)
    .then (function (responselisthistory)
    {
        if(angular.isArray(responselisthistory))
        {
            $scope.showbuttonoutofcase = true;
        }
        else
        {
            $scope.showbuttonoutofcase = false;      
        }
    });
    
    $scope.whosync = function(typesync)
    {
        var detail = {};
        detail.USER_ID      = auth.id;
        detail.TANGGAL_SYNC = $filter('date')(new Date(),'yyyy-MM-dd');
        detail.TYPE_SYNC    = typesync;
        detail.WAKTU_SYNC   = $filter('date')(new Date(),'yyyy-MM-dd HH:mm:ss');
        detail.CREATE_AT    = $filter('date')(new Date(),'yyyy-MM-dd HH:mm:ss');
        detail.CREATE_BY    = auth.id;
        WhosyncService.setWhoSync(detail)
        .then(function (response)
        {
            console.log(response);
        });
    }
    $scope.sinkronproduct = function()
    {
    	$scope.loadingcontent = true;
        var querybarang = "delete from Brgpenjualan";
        document.addEventListener("deviceready", function () 
        {
            $cordovaSQLite.execute($rootScope.db, querybarang, [])
            .then(function(result) 
            {
                alert("Product Berhasil Di Hapus");
                ProductService.GetDataBarangsSqlite()
                .then(function(response)
                {
                    angular.forEach(response,function(value,key)
                    {
                        alert(value.KD_BARANG);
                    })
                    $scope.showbuttonproduct = false;
                },
                function(error)
                {
                    alert("Product Gagal Di Sinkronisasi");
                })
                .finally(function()
                {
                    $scope.loadingcontent = false;
                });
            },
            function(error) 
            {
                alert("Tidak Bisa Menghapus Product");
            })
            .finally(function()
            {
                $scope.loadingcontent = false;  
            });
        },false);

        var TYPE_SYNC = 'PRODUCT';
        $scope.whosync(TYPE_SYNC);  
    }
    $scope.sinkronscdlkalender = function()
    {
        $scope.loadingcontent = true;
        document.addEventListener("deviceready", function () 
        {
            var querybarang = "delete from Scdlheader";
            $cordovaSQLite.execute($rootScope.db, querybarang, [])
            .then(function(result) 
            {
                alert("Schedule Anda Telah Berhasil Disinkronkan Dengan Server");
            },
            function(error) 
            {
                alert("Schedule Anda Gagal Disinkronkan Dengan Server");
            })
            .finally(function()
            {
                $scope.loadingcontent = false;  
            });
        },false);

        var TYPE_SYNC = 'SCDLKALENDER';
        $scope.whosync(TYPE_SYNC);  
    }
    $scope.sinkronagenda = function()
    {
        $scope.loadingcontent = true;
        document.addEventListener("deviceready", function () 
        {
            var querybarang = "delete from Agenda";
            $cordovaSQLite.execute($rootScope.db, querybarang, [])
            .then(function(result) 
            {
                alert("Agenda Anda Telah Berhasil Disinkronkan Dengan Server");
            },
            function(error) 
            {
                alert("Agenda Anda Gagal Disinkronkan Dengan Server");
            })
            .finally(function()
            {
                $scope.loadingcontent = false;  
            });
        },false);

        var TYPE_SYNC = 'AGENDA';
        $scope.whosync(TYPE_SYNC);  
    }
    $scope.sinkronabsensi = function()
    {
        $scope.loadingcontent = true;
        document.addEventListener("deviceready", function () 
        {
            var querybarang = "delete from Absensi";
            $cordovaSQLite.execute($rootScope.db, querybarang, [])
            .then(function(result) 
            {
                alert("Absensi Anda Telah Berhasil Disinkronkan Dengan Server");
            },
            function(error) 
            {
                alert("Absensi Anda Gagal Disinkronkan Dengan Server");
            })
            .finally(function()
            {
                $scope.loadingcontent = false;  
            });
        },false);

        var TYPE_SYNC = 'ABSENSI';
        $scope.whosync(TYPE_SYNC);  
    }
    $scope.Sot2 = function()
    {
        $scope.loadingcontent = true;
        var querybarang = "delete from Sot2";
        document.addEventListener("deviceready", function () 
        {
            $cordovaSQLite.execute($rootScope.db, querybarang, [])
            .then(function(result) 
            {
                alert("Sot2 Anda Telah Berhasil Disinkronkan Dengan Server");
            },
            function(error) 
            {
                alert("Sot2 Anda Gagal Disinkronkan Dengan Server");
            })
            .finally(function()
            {
                $scope.loadingcontent = false;  
            });
        },false);

        var TYPE_SYNC = 'SOT2';
        $scope.whosync(TYPE_SYNC);  
    }
    $scope.Sot2Type = function()
    {
        $scope.loadingcontent = true;
        document.addEventListener("deviceready", function () 
        {
            var querybarang = "delete from Sot2Type";
            $cordovaSQLite.execute($rootScope.db, querybarang, [])
            .then(function(result) 
            {
                alert("Sot2Type Anda Telah Berhasil Disinkronkan Dengan Server");
            },
            function(error) 
            {
                alert("Sot2Type Anda Gagal Disinkronkan Dengan Server");
            })
            .finally(function()
            {
                $scope.loadingcontent = false;  
            });
        },false);
        var TYPE_SYNC = 'SOT2TYPE';
        $scope.whosync(TYPE_SYNC);  
    }
    $scope.OutofCase = function()
    {
        
        $scope.showbuttonoutofcase = false;
        $scope.loadingcontent = true;
        var detail = {};
        detail.TGL1         = $filter('date')(new Date(),'yyyy-MM-dd');
        detail.TGL2         = $filter('date')(new Date(),'yyyy-MM-dd');
        detail.SCDL_GROUP   = 'OUTOFCASE';
        detail.USER_ID      = auth.id;
        detail.NOTE         = 'OUTOFCASE';
        detail.STATUS       = 1;
        detail.CREATE_BY    = auth.id;
        detail.CREATE_AT    = $filter('date')(new Date(),'yyyy-MM-dd HH:mm:ss');
        detail.UPDATE_BY    = auth.id;
        detail.STT_UBAH     = 1;
        detail.UPDATE_AT    = $filter('date')(new Date(),'yyyy-MM-dd HH:mm:ss');

        OutCaseService.SetHeaderOutOfCases(detail)
        .then (function (response)
        {
            alert("Agenda Out of Case Berhasil Ditambahkan");
            var newID_SERVER        = response.ID;
            var newTGL1             = response.TGL1;
            var newSCDL_GROUP       = response.SCDL_GROUP;
            var newUSER_ID          = response.USER_ID;
            var newNOTE             = response.NOTE;
            var newSTATUS_HEADER    = response.STATUS;

            var queryinsertscdlheader = 'INSERT INTO Scdlheader (ID_SERVER,TGL1,SCDL_GROUP,USER_ID,NOTE,STATUS_HEADER) VALUES (?,?,?,?,?,?)';
            $cordovaSQLite.execute($rootScope.db,queryinsertscdlheader,[newID_SERVER,newTGL1,newSCDL_GROUP,newUSER_ID,newNOTE,newSTATUS_HEADER])
            .then(function(result) 
            {
                console.log("SCDL Header Berhasil Disimpan Di Local!");
            }, 
            function(error) 
            {
                alert("SCDL Header Gagal Disimpan Ke Local: " + error.message);
            });

            var TYPE_SYNC = 'ADDOUTOFCASE';
            $scope.whosync(TYPE_SYNC);
        },
        function (error)
        {
            alert("Gagal Menyimpan Agenda Out OF Case");
        })
        .finally(function()
        {
            $scope.loadingcontent = false;  
        });     
    }

    $scope.SinkronCustomers = function()
    {
        var forcesinkron = confirm("Customer Akan Disinkronisasi. Kamu Yakin?");
        if (forcesinkron == true) 
        {
            $scope.loadingcontent   = true;
            $scope.showbuttonsynccustomers = false;
            document.addEventListener("deviceready", function () 
            {
                var querycustomers = "delete from Customers";
                $cordovaSQLite.execute($rootScope.db, querycustomers, [])
                .then(function(result) 
                {
                    var TYPE_SYNC = 'CUSTOMERS';
                    $scope.whosync(TYPE_SYNC);
                    alert("Customer Telah Berhasil Disinkronkan Dengan Server");
                },
                function(error) 
                {
                    alert("Customer Gagal Disinkronkan Dengan Server");
                })
                .finally(function()
                {
                    $scope.loadingcontent = false;  
                });
            },false);
        }
        else
        {
            $scope.loadingcontent   = false;
        }    
    }  
}]);




