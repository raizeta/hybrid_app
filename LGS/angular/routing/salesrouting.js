'use strict';
myAppModule.config(['$routeProvider', function($routeProvider,$authProvider)
{
    $routeProvider.when('/absensi',
    {
        templateUrl : 'angular/partial/salesman/absensi.html',
        controller  : 'AbsensiController',
        resolve: 
        {
            auth: function ($q, authService,$location) 
            {
                var userInfo = authService.getUserInfo();
                if(userInfo)
                {
                   if (userInfo.rulename === 'SALESMAN') 
                    {
                        return $q.when(userInfo);
                    }
                    else
                    {
                        $location.path('/error/404');
                    } 
                }
                else 
                {
                    $location.path('/');
                }
            }
        }
    });

    $routeProvider.when('/agenda/:idtanggal',
    {
        templateUrl : 'angular/partial/salesman/agenda.html',
        controller  : 'DetailAgendaController',
        resolve: 
        {
            auth: function ($q, authService,$location) 
            {
                var userInfo = authService.getUserInfo();
                if(userInfo)
                {
                   if (userInfo.rulename === 'SALESMAN') 
                    {
                        return $q.when(userInfo);
                    }
                    else
                    {
                        $location.path('/error/404');
                    } 
                }
                else 
                {
                    $location.path('/');
                }
            },
            resolvestatusabsensi: function($q,AbsensiSqliteServices,authService,$filter)
            {
                var tanggalplan             = $filter('date')(new Date(),'yyyy-MM-dd');
                var userInfo                = authService.getUserInfo();
                var resolvestatusabsensi    = AbsensiSqliteServices.getAbsensiStatus(tanggalplan,userInfo.id);
                return resolvestatusabsensi;
            },
            resolveobjectbarangsqlite: function($q,ProductService)
            {
                var resultobjectbarangsqlite = ProductService.GetDataBarangsSqlite();
                return $q.when(resultobjectbarangsqlite);
            },
            resolvesot2type: function($q,SOT2Services)
            {
                var resultsot2type = SOT2Services.getSOT2Type();
                return $q.when(resultsot2type);
            }
        }
    });

    $routeProvider.when('/detailjadwalkunjungan/:iddetailkunjungan',
    {
        templateUrl : 'angular/partial/salesman/detailjadwalkunjungan.html',
        controller  : 'DetailJadwalKunjunganController',
        resolve: 
        {
            auth: function ($q, authService,$location) 
            {
                var userInfo = authService.getUserInfo();
                if(userInfo)
                {
                   if (userInfo.rulename === 'SALESMAN') 
                    {
                        return $q.when(userInfo);
                    }
                    else
                    {
                        $location.path('/error/404');
                    } 
                }
                else 
                {
                    $location.path('/');
                }
            },
            resolveobjectbarangsqlite: function($q,ProductService)
            {
                var resultobjectbarangsqlite = ProductService.GetDataBarangsSqlite();
                return resultobjectbarangsqlite;
            },
            resolvesot2type: function($q,SOT2Services)
            {
                var resultsot2type = SOT2Services.getSOT2Type();
                return resultsot2type;
            },
            resolveagendabyidserver: function($q,AgendaSqliteServices,$route)
            {
                var ID_SERVER              = $route.current.params.iddetailkunjungan;
                var resultagendabyidserver = AgendaSqliteServices.getAgendaByIdServer(ID_SERVER);
                return resultagendabyidserver;
            }
        }
    });

    $routeProvider.when('/history',
    {
        templateUrl : 'angular/partial/salesman/history.html',
        controller  : 'HistoryController',
        resolve: 
        {
            auth: function ($q,authService,$location) 
            {
                var userInfo = authService.getUserInfo();
                if(userInfo)
                {
                   if (userInfo.rulename === 'SALESMAN') 
                    {
                        return $q.when(userInfo);
                    }
                    else
                    {
                        $location.path('/error/404');
                    } 
                }
                else 
                {
                    $location.path('/');
                }
            },
            resolvestatusabsensi: function($q,AbsensiSqliteServices,authService,$filter)
            {
                var tanggalplan             = $filter('date')(new Date(),'yyyy-MM-dd');
                var userInfo                = authService.getUserInfo();
                var resolvestatusabsensi    = AbsensiSqliteServices.getAbsensiStatus(tanggalplan,userInfo.id);
                return resolvestatusabsensi;
            }
        }
    });

    $routeProvider.when('/outcase',
    {
        templateUrl : 'angular/partial/salesman/outcase.html',
        controller  : 'OutCaseController',
        resolve: 
        {
            auth: function ($q, authService,$location) 
            {
                var userInfo = authService.getUserInfo();
                if(userInfo)
                {
                   if (userInfo.rulename === 'SALESMAN') 
                    {
                        return $q.when(userInfo);
                    }
                    else
                    {
                        $location.path('/error/404');
                    } 
                }
                else 
                {
                    $location.path('/');
                }
            },
            resolvestatusabsensi: function($q,AbsensiSqliteServices,authService,$filter)
            {
                var tanggalplan             = $filter('date')(new Date(),'yyyy-MM-dd');
                var userInfo                = authService.getUserInfo();
                var resolvestatusabsensi    = AbsensiSqliteServices.getAbsensiStatus(tanggalplan,userInfo.id);
                return resolvestatusabsensi;
            },
            resolveagendatoday: function ($q, authService,AgendaSqliteServices,$filter) 
            {
                var tanggalplan              = $filter('date')(new Date(),'yyyy-MM-dd');
                var userInfo                 = authService.getUserInfo();
                var resolveagendatoday       = AgendaSqliteServices.getAgendaTodayForOutCase(tanggalplan,userInfo.id);
                return resolveagendatoday;
            }
        }
    });

    $routeProvider.when('/noo',
    {
        templateUrl : 'angular/partial/salesman/noo.html',
        controller  : 'NOOController',
        resolve: 
        {
            auth: function ($q, authService,$location) 
            {
                var userInfo = authService.getUserInfo();
                if(userInfo)
                {
                   if (userInfo.rulename === 'SALESMAN') 
                    {
                        return $q.when(userInfo);
                    }
                    else
                    {
                        $location.path('/error/404');
                    } 
                }
                else 
                {
                    $location.path('/');
                }
            }
        }
    });

    $routeProvider.when('/listnoo',
    {
        templateUrl : 'angular/partial/salesman/listnoo.html',
        controller  : 'ListNOOController',
        resolve: 
        {
            auth: function ($q, authService,$location) 
            {
                var userInfo = authService.getUserInfo();
                if(userInfo)
                {
                   if (userInfo.rulename === 'SALESMAN') 
                    {
                        return $q.when(userInfo);
                    }
                    else
                    {
                        $location.path('/error/404');
                    } 
                }
                else 
                {
                    $location.path('/');
                }
            }
        }
    });

    $routeProvider.when('/berkasnoo/:idcustomer',
    {
        templateUrl : 'angular/partial/salesman/berkasnoo.html',
        controller  : 'BerkasNOOController',
        resolve: 
        {
            auth: function ($q, authService,$location) 
            {
                var userInfo = authService.getUserInfo();
                if(userInfo)
                {
                   if (userInfo.rulename === 'SALESMAN') 
                    {
                        return $q.when(userInfo);
                    }
                    else
                    {
                        $location.path('/error/404');
                    } 
                }
                else 
                {
                    $location.path('/');
                }
            }
        }
    });
    
    $routeProvider.when('/kpi',
    {
        templateUrl : 'angular/partial/salesman/kpi.html',
        controller  : 'KPIController',
        resolve: 
        {
            auth: function ($q, authService,$location) 
            {
                var userInfo = authService.getUserInfo();
                if(userInfo)
                {
                   if (userInfo.rulename === 'SALESMAN') 
                    {
                        return $q.when(userInfo);
                    }
                    else
                    {
                        $location.path('/error/404');
                    } 
                }
                else 
                {
                    $location.path('/');
                }
            }
        }
    });

    $routeProvider.when('/home',
    {
        templateUrl : 'angular/partial/salesman/home.html',
        controller  : 'HomeController',
        resolve: 
        {
            auth: function ($q, authService,$location) 
            {
                var userInfo = authService.getUserInfo();
                if(userInfo)
                {
                   if (userInfo.rulename === 'SALESMAN') 
                    {
                        return $q.when(userInfo);
                    }
                    else
                    {
                        $location.path('/error/404');
                    } 
                }
                else 
                {
                    $location.path('/');
                }
            }
        }
    });

    $routeProvider.when('/help',
    {
        templateUrl : 'angular/partial/salesman/help.html',
        controller  : 'HelpController',
        resolve: 
        {
            auth: function ($q, authService,$location) 
            {
                var userInfo = authService.getUserInfo();
                if(userInfo)
                {
                   if (userInfo.rulename === 'SALESMAN') 
                    {
                        return $q.when(userInfo);
                    }
                    else
                    {
                        $location.path('/error/404');
                    } 
                }
                else 
                {
                    $location.path('/');
                }
            }
        }
    });

    $routeProvider.when('/configuration',
    {
        templateUrl : 'angular/partial/salesman/configuration.html',
        controller  : 'ConfigurationController',
        resolve: 
        {
            auth: function ($q, authService,$location) 
            {
                var userInfo = authService.getUserInfo();
                if(userInfo)
                {
                   if (userInfo.rulename === 'SALESMAN') 
                    {
                        return $q.when(userInfo);
                    }
                    else
                    {
                        $location.path('/error/404');
                    } 
                }
                else 
                {
                    $location.path('/');
                }
            }
        }
    });

    $routeProvider.when('/setposition',
    {
        templateUrl : 'angular/partial/salesman/setposition.html',
        controller  : 'SetPositionController',
        resolve: 
        {
            auth: function ($q, authService,$location) 
            {
                var userInfo = authService.getUserInfo();
                if(userInfo)
                {
                   if (userInfo.rulename === 'SALESMAN') 
                    {
                        return $q.when(userInfo);
                    }
                    else
                    {
                        $location.path('/error/404');
                    } 
                }
                else 
                {
                    $location.path('/');
                }
            }
        }
    });

    $routeProvider.when('/salestrack',
    {
        templateUrl : 'angular/partial/salesman/salestrack.html',
        controller  : 'SalesTrackController',
        resolve: 
        {
            auth: function ($q, authService,$location) 
            {
                var userInfo = authService.getUserInfo();
                if(userInfo)
                {
                   if (userInfo.rulename === 'SALESMAN') 
                    {
                        return $q.when(userInfo);
                    }
                    else
                    {
                        $location.path('/error/404');
                    } 
                }
                else 
                {
                    $location.path('/');
                }
            }
        }
    });

    $routeProvider.when('/salestrack/:idsalesman',
    {
        templateUrl : 'angular/partial/salesman/salestrackperuser.html',
        controller  : 'SalesTrackPerUserController',
        resolve: 
        {
            auth: function ($q, authService,$location) 
            {
                var userInfo = authService.getUserInfo();
                if(userInfo)
                {
                   if (userInfo.rulename === 'SALESMAN') 
                    {
                        return $q.when(userInfo);
                    }
                    else
                    {
                        $location.path('/error/404');
                    } 
                }
                else 
                {
                    $location.path('/');
                }
            }
        }
    });

    $routeProvider.when('/detailcustomer/:idcustomer/:idtanggal',
    {
        templateUrl : 'angular/partial/salesman/detailcustomer.html',
        controller  : 'DetailCustomerController',
        resolve: 
        {
            auth: function ($q, authService,$location) 
            {
                var userInfo = authService.getUserInfo();
                if(userInfo)
                {
                   if (userInfo.rulename === 'SALESMAN') 
                    {
                        return $q.when(userInfo);
                    }
                    else
                    {
                        $location.path('/error/404');
                    } 
                }
                else 
                {
                    $location.path('/');
                }
            }
        }
    });
    
    $routeProvider.when('/dblocal',
    {
        templateUrl : 'angular/partial/salesman/dblocal.html',
        controller  : 'DBLocalController',
        resolve: 
        {
            auth: function ($q, authService,$location) 
            {
                var userInfo = authService.getUserInfo();
                if(userInfo)
                {
                   if (userInfo.rulename === 'SALESMAN') 
                    {
                        return $q.when(userInfo);
                    }
                    else
                    {
                        $location.path('/error/404');
                    } 
                }
                else 
                {
                    $location.path('/');
                }
            }
        }
    });
    
    $routeProvider.otherwise({redirectTo:'/error/404'});

}]);
