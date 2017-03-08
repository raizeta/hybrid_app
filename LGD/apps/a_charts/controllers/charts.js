angular.module('starter')
 .controller('ChartsCtrl', function($window,$timeout,$rootScope,$scope,$state,$ionicPopup,$ionicLoading,$ionicModal,$cordovaGeolocation,NgMap,UtilService,MenuService,ChartsSalesFac,CustomerFac,ChartsPurchasesFac) 
{
    var menus = [];
    // menus.push({src: "assets/img/img/200x200/chart.jpg",link:"openModalMap()",judul:"MAP"});
    // menus.push({src: "assets/img/img/200x200/chart.jpg",link:"openModalSales()",judul:"Sales-MD"});
    // menus.push({src: "assets/img/img/200x200/chart.jpg",link:"openModalPurchases()",judul:"Purchases"});
    menus.push({src: "assets/img/img/200x200/chart.jpg",link:"openModalProducts()",judul:"Products"});
    // menus.push({src: "assets/img/img/200x200/chart.jpg",link:"openModalCustomers()",judul:"Customers"});
    menus.push({src: "assets/img/img/200x200/chart.jpg",link:"openModalSupliers()",judul:"Supliers"});
    menus.push({src: "assets/img/img/200x200/chart.jpg",link:"openModalSPG()",judul:"SPG"});
    
    $scope.menus = UtilService.ArrayChunk(menus,4);
    $rootScope.sidemenu = MenuService.DashboardMenu();

    $scope.openModalProducts = function(item) 
    {
        $ionicModal.fromTemplateUrl('apps/a_charts/views/charts-products.html', 
        {
            scope: $scope,
            animation: 'fade-in-scale'
        })
        .then(function(modal) 
        {
            $ionicLoading.show
            ({
                template: 'Loading...'
            });
            
            ChartsSalesFac.GetVisitStock()
            .then(function (response)
            {
                FusionCharts.ready(function() 
                {
                  var conversionChart = new FusionCharts(
                  {
                    type: 'msline',
                    renderAt: 'chart-visit',
                    width: "100%",
                    dataFormat: 'json',
                    dataSource: response.Visit
                  });

                  conversionChart.render();
                });
                $scope.modal            = modal;
                $scope.modal.show();
            },
            function(error)
            {
                console.log(error);
                alert("Belum Ada Data Untuk Bulan Ini");
            });
            

            
            $timeout(function()
            {
                $ionicLoading.hide();
            },3000);
        });  
    };
    $scope.openModalCustomers = function(item) 
    {
        $ionicModal.fromTemplateUrl('apps/a_charts/views/charts-customers.html', 
        {
            scope: $scope,
            animation: 'fade-in-scale'
        })
        .then(function(modal) 
        {
            $ionicLoading.show
            ({
                template: 'Loading...'
            });

            $scope.Piramid =
            {
                "chart": {"caption":"Summary Category Parent","alignCaptionWithCanvas":"2","theme":"fint","bgColor":"#ffffff","showBorder":"0","showCanvasBorder":"1","is2D":"0","showValues":"1","showLegend":"1","showPercentValues":"1"},
                "data": [{"label":"MODERN","value":"224"},{"label":"General ","value":"7"},{"label":"Horeca","value":"0"},{"label":"Others","value":"0"}]  
            };
            FusionCharts.ready(function() 
            {
              var conversionChart = new FusionCharts(
              {
                type: 'pyramid',
                renderAt: 'chart-piramid',
                width: "100%",
                dataFormat: 'json',
                dataSource: $scope.Piramid
              });

              conversionChart.render();
            });
            $scope.modal            = modal;
            $scope.modal.show();
            $timeout(function()
            {
                $ionicLoading.hide();
            },3000);
        });  
    };

    $scope.openModalSupliers = function(item) 
    {
        $ionicModal.fromTemplateUrl('apps/a_charts/views/charts-supliers.html', 
        {
            scope: $scope,
            animation: 'fade-in-scale'
        })
        .then(function(modal) 
        {
            $ionicLoading.show
            ({
                template: 'Loading...'
            });

            $scope.Piramid =
            {
                "chart": {"caption":"Summary Category Parent","alignCaptionWithCanvas":"2","theme":"fint","bgColor":"#ffffff","showBorder":"0","showCanvasBorder":"1","is2D":"0","showValues":"1","showLegend":"1","showPercentValues":"1"},
                "data": [{"label":"MODERN","value":"224"},{"label":"General ","value":"7"},{"label":"Horeca","value":"0"},{"label":"Others","value":"0"}]  
            };
            FusionCharts.ready(function() 
            {
              var conversionChart = new FusionCharts(
              {
                type: 'pyramid',
                renderAt: 'chart-piramid',
                width: "100%",
                dataFormat: 'json',
                dataSource: $scope.Piramid
              });

              conversionChart.render();
            });

            $scope.modal            = modal;
            $scope.modal.show();
            $timeout(function()
            {
                $ionicLoading.hide();
            },3000);
        });  
    };

    $scope.openModalPurchases = function(item) 
    {
        $ionicModal.fromTemplateUrl('apps/a_charts/views/charts-purchases.html', 
        {
            scope: $scope,
            animation: 'fade-in-scale'
        })
        .then(function(modal) 
        {
            $ionicLoading.show
            ({
                template: 'Loading...'
            });

            ChartsPurchasesFac.GetPOPrice()
            .then(function(response)
            {
                FusionCharts.ready(function() 
                {
                    var conversionChartPOPriceYear = new FusionCharts(
                    {
                        type: 'mscolumn3d',
                        renderAt: 'chart-po-price-year',
                        width: "100%",
                        dataFormat: 'json',
                        dataSource: response.PO_PriceYear
                    });
                    conversionChartPOPriceYear.render();

                    var conversionChartPOQtyYear = new FusionCharts(
                    {
                        type: 'mscolumn3d',
                        renderAt: 'chart-po-stock-year',
                        width: "100%",
                        dataFormat: 'json',
                        dataSource: response.PO_StockYear
                    });
                    conversionChartPOQtyYear.render();

                    var conversionChartPOStock = new FusionCharts(
                    {
                        type: 'mscolumn3d',
                        renderAt: 'chart-po-stock',
                        width: "100%",
                        dataFormat: 'json',
                        dataSource: response.PO_Stock
                    });
                    conversionChartPOStock.render();

                    var conversionChartPOPrice = new FusionCharts(
                    {
                        type: 'mscolumn3d',
                        renderAt: 'chart-po-price',
                        width: "100%",
                        dataFormat: 'json',
                        dataSource: response.PO_Price
                    });
                    conversionChartPOPrice.render();
                });

                $scope.modal            = modal;
                $scope.modal.show(); 
            });
            
            $timeout(function()
            {
                $ionicLoading.hide();
            },3000);
        });  
    };

    $scope.openModalSales = function(item) 
    {
        $ionicModal.fromTemplateUrl('apps/a_charts/views/charts-sales.html', 
        {
            scope: $scope,
            animation: 'fade-in-scale'
        })
        .then(function(modal) 
        {
            $ionicLoading.show
            ({
                template: 'Loading...'
            });

            ChartsSalesFac.GetVisitStock()
            .then(function (response)
            {
                FusionCharts.ready(function() 
                {
                  var conversionChart = new FusionCharts(
                  {
                    type: 'msline',
                    renderAt: 'chart-visit',
                    width: "100%",
                    dataFormat: 'json',
                    dataSource: response.Visit
                  });

                  conversionChart.render();
                });

                FusionCharts.ready(function() 
                {
                  var conversionChart = new FusionCharts(
                  {
                    type: 'mscolumn3d',
                    renderAt: 'chart-actionvisit',
                    width: "100%",
                    dataFormat: 'json',
                    dataSource: response.ActionVisit
                  });

                  conversionChart.render();
                });

                FusionCharts.ready(function() 
                {
                  var conversionChart = new FusionCharts(
                  {
                    type: 'mscolumn3d',
                    renderAt: 'chart-actionvisitrequest',
                    width: "100%",
                    dataFormat: 'json',
                    dataSource: response.ActionVisitRequest
                  });

                  conversionChart.render();
                });

                FusionCharts.ready(function() 
                {
                  var conversionChart = new FusionCharts(
                  {
                    type: 'mscolumn3d',
                    renderAt: 'chart-actionvisitsellout',
                    width: "100%",
                    dataFormat: 'json',
                    dataSource: response.ActionVisitSellout
                  });

                  conversionChart.render();
                });
                $scope.modal            = modal;
                $scope.modal.show();
                $timeout(function()
                {
                    $ionicLoading.hide();
                },3000);
                
            },
            function(error)
            {
                console.log(error);
                alert("Belum Ada Data Untuk Bulan Ini");
                $ionicLoading.hide();
            });

                        
            
        });  
    };

    $scope.openModalSPG = function(item) 
    {
        $ionicModal.fromTemplateUrl('apps/a_charts/views/charts-spg.html', 
        {
            scope: $scope,
            animation: 'fade-in-scale'
        })
        .then(function(modal) 
        {
            $ionicLoading.show
            ({
                template: 'Loading...'
            });

            $scope.Piramid =
            {
                "chart": {"caption":"Summary Category Parent","alignCaptionWithCanvas":"2","theme":"fint","bgColor":"#ffffff","showBorder":"0","showCanvasBorder":"1","is2D":"0","showValues":"1","showLegend":"1","showPercentValues":"1"},
                "data": [{"label":"MODERN","value":"224"},{"label":"General ","value":"7"},{"label":"Horeca","value":"0"},{"label":"Others","value":"0"}]  
            };
            FusionCharts.ready(function() 
            {
              var conversionChart = new FusionCharts(
              {
                type: 'pyramid',
                renderAt: 'chart-piramid',
                width: "100%",
                dataFormat: 'json',
                dataSource: $scope.Piramid
              });

              conversionChart.render();
            });

            $scope.modal            = modal;
            $scope.modal.show();
            $timeout(function()
            {
                $ionicLoading.hide();
            },3000);
        });  
    };

    $scope.openModalMap = function(item) 
    {
        $ionicModal.fromTemplateUrl('apps/a_charts/views/charts-map.html', 
        {
            scope: $scope,
            animation: 'fade-in-scale'
        })
        .then(function(modal) 
        {
            $ionicLoading.show
            ({
                template: 'Loading...'
            });

            NgMap.getMap().then(function(map) 
            {
                $scope.map = map;
            });

            var options = {timeout: 10000, enableHighAccuracy: true};
            $cordovaGeolocation.getCurrentPosition(options)
            .then(function(position)
            {
                $scope.googlemaplat = position.coords.latitude;
                $scope.googlemaplong = position.coords.longitude;
            }, 
            function(error)
            {
                console.log("Could not get location");
            });
            CustomerFac.GetCustomersMap()
            .then(function(response)
            {
                $scope.customers = response.CustMap;
                $scope.icons     = response.icon;
                var total = 0;
                angular.forEach($scope.customers,function(value,key)
                {
                    if(value.STT_ONLINE == 1)
                    {
                        value.icons     = $scope.icons[1].MAP_ICON;
                        value.animation = "BOUNCE";

                    }
                    else if(value.STT_ONLINE == 0)
                    {
                        value.icons     = $scope.icons[0].MAP_ICON;
                    }

                });
            });

            $scope.showdetail = function(e,item)
            {
                $scope.selecteditem = item;
                $scope.map.showInfoWindow('myInfoWindow', this);
                $scope.customershow = true;
            }

            $scope.modal            = modal;
            $scope.modal.show();
            $timeout(function()
            {
                $ionicLoading.hide();
            },3000);
        });  
    };

    $scope.closeModal = function() 
    {
        $scope.modal.remove();
    };
    $scope.$on('$destroy', function() 
    {
        $scope.modal.remove();
    });
})

.controller('ChartProductsCtrl', function($window,$timeout,$rootScope,$scope,$state,$ionicPopup,$ionicLoading,MenuService) 
{
	$rootScope.sidemenu = MenuService.ChartsMenu();
    $ionicLoading.show
    ({
        template: 'Loading...'
    });
    $timeout(function()
	{
		$ionicLoading.hide();
	},3000);
	$scope.myDataSource =
    {
        "chart": {
            "caption": "Week Sales ",
            "numberprefix": "",
            "plotgradientcolor": "",
            "bgcolor": "FFFFFF",
            "showalternatehgridcolor": "0",
            "divlinecolor": "CCCCCC",
            "showvalues": "0",
            "showcanvasborder": "0",
            "canvasborderalpha": "0",
            "canvasbordercolor": "CCCCCC",
            "canvasborderthickness": "1",
            "yaxismaxvalue": "200",
            "captionpadding": "30",
            "linethickness": "3",
            "yaxisvaluespadding": "15",
            "legendshadow": "0",
            "legendborderalpha": "0",
            "palettecolors": "#6baa01,#33bdda,#e44a00,#6baa01,#583e78",
            "showborder": "1"
        },
        "categories": [
            {
                "category": [
                    {
                        "label": "Senin"
                    },
                    {
                        "label": "Selasa"
                    },
                    {
                        "label": "Rabu"
                    },
                    {
                        "label": "Kamis"
                    },
                    {
                        "label": "Jumat"
                    },
                    {
                        "label": "Sabtu"
                    },
                    {
                        "label": "Minggu"
                    }
                ]
            }
        ],
        "dataset": [
            {
                "seriesname": "Minggu Ke-1",
                "data": [
                    {
                        "value": "10000"
                    },
                    {
                        "value": "11500"
                    },
                    {
                        "value": "12500"
                    },
                    {
                        "value": "15000"
                    },
                    {
                        "value": "15000"
                    },
                    {
                        "value": "15000"
                    },
                    {
                        "value": "15000"
                    }
                ]
            },
            {
                "seriesname": "Minggu Ke-2",
                "data": [
                    {
                        "value": "25400"
                    },
                    {
                        "value": "29800"
                    },
                    {
                        "value": "21800"
                    },
                    {
                        "value": "20800"
                    },
                    {
                        "value": "26800"
                    },
                    {
                        "value": "26800"
                    },
                    {
                        "value": "26800"
                    }
                ]
            },
            {
                "seriesname": "Minggu Ke-3",
                "data": [
                    {
                        "value": "35400"
                    },
                    {
                        "value": "39800"
                    },
                    {
                        "value": "31800"
                    },
                    {
                        "value": "30800"
                    },
                    {
                        "value": "36800"
                    },
                    {
                        "value": "36800"
                    },
                    {
                        "value": "36800"
                    }
                ]
            },
            {
                "seriesname": "Minggu Ke-4",
                "data": [
                    {
                        "value": "45400"
                    },
                    {
                        "value": "49800"
                    },
                    {
                        "value": "41800"
                    },
                    {
                        "value": "46800"
                    },
                    {
                        "value": "46800"
                    },
                    {
                        "value": "46800"
                    },
                    {
                        "value": "46800"
                    }
                ]
            }
        ]
    };
    FusionCharts.ready(function() 
    {
      var conversionChart = new FusionCharts(
      {
        type: 'msline',
        renderAt: 'chart-salesdaily',
        width: "100%",
        dataFormat: 'json',
        dataSource: $scope.myDataSource
      });

      conversionChart.render();
    });
    FusionCharts.ready(function() 
    {
      var conversionChart = new FusionCharts(
      {
        type: 'msline',
        renderAt: 'chart-salesweekly',
        width: "100%",
        dataFormat: 'json',
        dataSource: $scope.myDataSource
      });

      conversionChart.render();
    });
    FusionCharts.ready(function() 
    {
      var conversionChart = new FusionCharts(
      {
        type: 'msline',
        renderAt: 'chart-salesmonthly',
        width: "100%",
        dataFormat: 'json',
        dataSource: $scope.myDataSource
      });

      conversionChart.render();
    });
})

.controller('ChartCustomersCtrl', function($window,$timeout,$rootScope,$scope,$state,$ionicPopup,$ionicLoading,MenuService) 
{
    $rootScope.sidemenu = MenuService.ChartsMenu();
    $ionicLoading.show
    ({
        template: 'Loading...'
    });
    $timeout(function()
    {
        $ionicLoading.hide();
    },3000);
    $scope.myDataSource =
    {
        "chart": {
            "caption": "Week Sales ",
            "numberprefix": "",
            "plotgradientcolor": "",
            "bgcolor": "FFFFFF",
            "showalternatehgridcolor": "0",
            "divlinecolor": "CCCCCC",
            "showvalues": "0",
            "showcanvasborder": "0",
            "canvasborderalpha": "0",
            "canvasbordercolor": "CCCCCC",
            "canvasborderthickness": "1",
            "yaxismaxvalue": "200",
            "captionpadding": "30",
            "linethickness": "3",
            "yaxisvaluespadding": "15",
            "legendshadow": "0",
            "legendborderalpha": "0",
            "palettecolors": "#6baa01,#33bdda,#e44a00,#6baa01,#583e78",
            "showborder": "1"
        },
        "categories": [
            {
                "category": [
                    {
                        "label": "Senin"
                    },
                    {
                        "label": "Selasa"
                    },
                    {
                        "label": "Rabu"
                    },
                    {
                        "label": "Kamis"
                    },
                    {
                        "label": "Jumat"
                    },
                    {
                        "label": "Sabtu"
                    },
                    {
                        "label": "Minggu"
                    }
                ]
            }
        ],
        "dataset": [
            {
                "seriesname": "Minggu Ke-1",
                "data": [
                    {
                        "value": "10000"
                    },
                    {
                        "value": "11500"
                    },
                    {
                        "value": "12500"
                    },
                    {
                        "value": "15000"
                    },
                    {
                        "value": "15000"
                    },
                    {
                        "value": "15000"
                    },
                    {
                        "value": "15000"
                    }
                ]
            },
            {
                "seriesname": "Minggu Ke-2",
                "data": [
                    {
                        "value": "25400"
                    },
                    {
                        "value": "29800"
                    },
                    {
                        "value": "21800"
                    },
                    {
                        "value": "20800"
                    },
                    {
                        "value": "26800"
                    },
                    {
                        "value": "26800"
                    },
                    {
                        "value": "26800"
                    }
                ]
            },
            {
                "seriesname": "Minggu Ke-3",
                "data": [
                    {
                        "value": "35400"
                    },
                    {
                        "value": "39800"
                    },
                    {
                        "value": "31800"
                    },
                    {
                        "value": "30800"
                    },
                    {
                        "value": "36800"
                    },
                    {
                        "value": "36800"
                    },
                    {
                        "value": "36800"
                    }
                ]
            },
            {
                "seriesname": "Minggu Ke-4",
                "data": [
                    {
                        "value": "45400"
                    },
                    {
                        "value": "49800"
                    },
                    {
                        "value": "41800"
                    },
                    {
                        "value": "46800"
                    },
                    {
                        "value": "46800"
                    },
                    {
                        "value": "46800"
                    },
                    {
                        "value": "46800"
                    }
                ]
            }
        ]
    };
    FusionCharts.ready(function() 
    {
      var conversionChart = new FusionCharts(
      {
        type: 'msline',
        renderAt: 'chart-salesdaily',
        width: "100%",
        dataFormat: 'json',
        dataSource: $scope.myDataSource
      });

      conversionChart.render();
    });
    FusionCharts.ready(function() 
    {
      var conversionChart = new FusionCharts(
      {
        type: 'msline',
        renderAt: 'chart-salesweekly',
        width: "100%",
        dataFormat: 'json',
        dataSource: $scope.myDataSource
      });

      conversionChart.render();
    });
    FusionCharts.ready(function() 
    {
      var conversionChart = new FusionCharts(
      {
        type: 'msline',
        renderAt: 'chart-salesmonthly',
        width: "100%",
        dataFormat: 'json',
        dataSource: $scope.myDataSource
      });

      conversionChart.render();
    });
})

.controller('XXXCtrl', function($window,$timeout,$rootScope,$scope,$state,$ionicPopup,$ionicLoading,MenuService,ChartsSalesFac,StorageService) 
{
    $rootScope.sidemenu = MenuService.ChartsMenu();
    $ionicLoading.show
    ({
        template: 'Loading...'
    });
    ChartsSalesFac.GetVisitStock()
    .then(function(response)
    {
        StorageService.set('chart-sale',response);
        FusionCharts.ready(function() 
        {
          var conversionChart = new FusionCharts(
          {
            type: 'msline',
            renderAt: 'chart-visit',
            width: "100%",
            dataFormat: 'json',
            dataSource: response.Visit
          });
          conversionChart.render();
        });
        $ionicLoading.hide();
    });
    
})
.controller('YYYCtrl', function($window,$timeout,$rootScope,$scope,$state,$ionicPopup,$ionicLoading,MenuService,ChartsSalesFac,StorageService) 
{
    $rootScope.sidemenu = MenuService.ChartsMenu();
    
    $ionicLoading.show
    ({
        template: 'Loading...'
    });
    var result = StorageService.get('chart-sale');
    FusionCharts.ready(function() 
    {
        
        var conversionChart = new FusionCharts(
        {
            type: 'mscolumn3d',
            renderAt: 'chart-actionvisit',
            width: "100%",
            dataFormat: 'json',
            dataSource: result.ActionVisit
        });
        conversionChart.render();
    });
    $ionicLoading.hide();
    
})
.controller('ZZZCtrl', function($window,$timeout,$rootScope,$scope,$state,$ionicPopup,$ionicLoading,MenuService,ChartsSalesFac,StorageService) 
{
    $rootScope.sidemenu = MenuService.ChartsMenu();
    $ionicLoading.show
    ({
        template: 'Loading...'
    });

    var result = StorageService.get('chart-sale');
    FusionCharts.ready(function() 
    {
      var conversionChart = new FusionCharts(
      {
        type: 'mscolumn3d',
        renderAt: 'chart-actionvisitrequest',
        width: "100%",
        dataFormat: 'json',
        dataSource: result.ActionVisitRequest
      });
      conversionChart.render();
    });
    
});

