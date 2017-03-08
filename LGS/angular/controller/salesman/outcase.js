myAppModule.controller("OutCaseController", ["$rootScope","$scope", "$location","$http","$filter","$timeout","$window","auth","CustomerCombFac","OutCaseService","JadwalKunjunganService","authService","$cordovaSQLite","resolvestatusabsensi","resolveagendatoday",
function ($rootScope,$scope, $location, $http,$filter,$timeout,$window,auth,CustomerCombFac,OutCaseService,JadwalKunjunganService,authService,$cordovaSQLite,resolvestatusabsensi,resolveagendatoday)
{
    $scope.userInfo = auth;
    $scope.loadingcontent  = true;
    $scope.activeoutcase = "active";

    $scope.logout = function () 
    { 
        $scope.userInfo = null;
        $window.sessionStorage.clear();
        window.location.href = "index.html";
    }
    
    authService.getManagers()
    .then (function (response)
    {
        $scope.managers = response;
    },
    function (error)
    {
        alert("Manager Error.Keluar Lalu Masuk Lagi");
    });

    $scope.getcustomers = function()
    {
        $scope.loadingcontent  = true;
        CustomerCombFac.GetCustomerCombine()
        .then(function (result) 
        {
            var customerparents     = [];
            var customers           = [];
            _.each(result, function(executes) 
            {
                if(executes.CUST_KD == executes.CUST_GRP)
                {
                    customerparents.push(executes)
                }
                else
                {
                    customers.push(executes);
                }
            });
            $scope.customeparents   = customerparents;
            $scope.customers        = customers;
        },
        function (error)
        {
            alert("Gagal Mendapatkan Customer Dari Server.Try Again");
        })
        .finally(function()
        {
            $scope.loadingcontent  = false;   
        });
    };
    $scope.getcustomers();

    $scope.customerparentchange = function()
    {
        $scope.showcustomer = true;
        $scope.loadingcontent      = false;
        $scope.visible      = false;
    }
    $scope.customerchange = function(customer)
    {
        $scope.showusers    = true;
        $scope.loadingcontent      = false;
        $scope.visible      = false;
    }

    $scope.submitForm = function(customer)
    {
        if(resolvestatusabsensi.statusabsensi == 0)
        {
            $scope.loadingcontent = true;
            $scope.isSubmitButtonDisabled = true;

            //Mencari Nama Customer Ketika Hanya Diketahui Kodenya Saja
            //Penting Jangan Dihapus
            var existingFilter = _.findWhere($scope.customers, { CUST_KD: customer.CUST_KD });

            var tanggalsekarang = $filter('date')(new Date(),'yyyy-MM-dd');
            JadwalKunjunganService.GetGroupCustomerByTanggalPlan(auth,tanggalsekarang)
            .then(function(response)
            {
                if(response.length == 0)
                {
                    $scope.loadingcontent = false;
                    alert("Belum Ada Jadwal Kunjungan Anda Hari Ini");
                }
                else
                {
                    var detail = {};
                    detail.TGL          = $filter('date')(new Date(),'yyyy-MM-dd')
                    detail.CUST_ID      = customer.CUST_KD;
                    detail.USER_ID      = auth.id;
                    detail.NOTE         = customer.MGRS; //MGRS = Managers
                    detail.STATUS_CASE  = 1;
                    detail.CREATE_AT    = $filter('date')(new Date(),'yyyy-MM-dd HH:mm:ss');
                    detail.CREATE_BY    = auth.id;
                    detail.SCDL_GROUP   = response.SCDL_GROUP;

                    var existonagendalist = _.findWhere(resolveagendatoday, { CUST_ID: detail.CUST_ID });
                    if(existonagendalist)
                    {
                        alert("Customer Sudah Ada Dalam List");
                        $scope.loadingcontent = false;
                        $scope.isSubmitButtonDisabled = false;
                    }
                    else
                    {
                        OutCaseService.SetOutOfCases(detail)
                        .then(function (result) 
                        {
                            var newID_SERVER                = result.ID;
                            var newTGL                      = tanggalsekarang;
                            var newUSER_ID                  = auth.id;
                            var newCUST_ID                  = result.CUST_ID;
                            var newCUST_NM                  = existingFilter.CUST_NM;
                            var newLAG                      = null;
                            var newLAT                      = null;
                            var newMAP_LAT                  = null;
                            var newMAP_LNG                  = null;
                            var newCHECKIN_TIME             = null;
                            var newCHECKOUT_TIME            = null;

                            var newSTSCHECK_IN              = 0;
                            var newSTSCHECK_OUT             = 0;
                            var newSTSINVENTORY_EXPIRED     = 0;
                            var newSTSINVENTORY_SELLIN      = 0;
                            var newSTSINVENTORY_SELLOUT     = 0;
                            var newSTSINVENTORY_STOCK       = 0;
                            var newSTSINVENTORY_REQUEST     = 0;
                            var newSTSINVENTORY_RETURN      = 0;
                            var newSTSSTART_PIC             = 0;
                            var newSTSEND_PIC               = 0;
                            var newSCDL_GROUP               = response.SCDL_GROUP;
                            var newSTSISON_SERVER           = 1;

                            var queryinsertagendatoday = 'INSERT INTO Agenda (ID_SERVER,TGL,USER_ID,CUST_ID,CUST_NM,LAG,LAT,MAP_LAT,MAP_LNG,CHECKIN_TIME,CHECKOUT_TIME,STSCHECK_IN,STSCHECK_OUT,STSINVENTORY_EXPIRED,STSINVENTORY_SELLIN,STSINVENTORY_SELLOUT,STSINVENTORY_STOCK,STSINVENTORY_REQUEST,STSINVENTORY_RETURN,STSSTART_PIC,STSEND_PIC,SCDL_GROUP,STSISON_SERVER) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)';
                            $cordovaSQLite.execute($rootScope.db,queryinsertagendatoday,[newID_SERVER,newTGL,newUSER_ID,newCUST_ID,newCUST_NM,newLAG,newLAT,newMAP_LAT,newMAP_LNG,newCHECKIN_TIME,newCHECKOUT_TIME,newSTSCHECK_IN,newSTSCHECK_OUT,newSTSINVENTORY_EXPIRED,newSTSINVENTORY_SELLIN,newSTSINVENTORY_SELLOUT,newSTSINVENTORY_STOCK,newSTSINVENTORY_REQUEST,newSTSINVENTORY_RETURN,newSTSSTART_PIC,newSTSEND_PIC,newSCDL_GROUP,newSTSISON_SERVER])
                            .then(function(result) 
                            {
                                console.log("Customer Untuk Out Of Case Berhasil Disimpan Di Local!");
                            }, 
                            function(error) 
                            {
                                alert("Customer Untuk Out Of Case Gagal Disimpan Ke Local: " + error.message);
                            });

                            $timeout(function()
                            {
                                var lanjutkeagenda = confirm("Out Case Berhasil Disimpan.Lanjut Ke Agenda?");
                                if (lanjutkeagenda == true) 
                                {
                                    $location.path("/agenda/" + tanggalsekarang);
                                }
                                else
                                {
                                    var tambahcustkeresolveagenda = {};
                                    tambahcustkeresolveagenda.CUST_ID = detail.CUST_ID;
                                    tambahcustkeresolveagenda.CUST_NM = existingFilter.CUST_NM;
                                    resolveagendatoday.push(tambahcustkeresolveagenda);
                                    $scope.loadingcontent = false;
                                    $scope.isSubmitButtonDisabled = false;
                                }
                                
                            },2000);
                        },
                        function (error)
                        {
                            alert("Out Case Gagal Ditambahkan");
                            $scope.loadingcontent = false;
                        }); 
                    }
                     
                }      
            });  
        }
        else if(resolvestatusabsensi.statusabsensi == 1)
        {
            alert("Sudah Absen Keluar.Tidak Bisa Lagi");
        }
        else
        {
            alert("Absen Masuk Terlebih Dahulu");
        }   
    }

}]);

