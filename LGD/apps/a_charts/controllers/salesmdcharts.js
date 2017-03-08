angular.module('starter')
.controller('VisitChartsCtrl', function($window,$timeout,$rootScope,$scope,$state,$filter,$ionicPopup,$ionicLoading,MenuService,ChartsSalesFac,StorageService) 
{
    $scope.example = {value: new Date()};
    $scope.onSearchChange = function()
    {
        console.log($scope.example);
        var bulan = parseInt($filter('date')($scope.example.value,'MM'));
        console.log(bulan);

        $ionicLoading.show
        ({
          template: 'Loading...'
        })
        .then(function()
        {
           ChartsSalesFac.GetVisitStock(bulan)
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
                $scope.showvisitchart = true;
            },
            function(error)
            {
                StorageService.destroy('chart-sale');
                var conversionChart = new FusionCharts(
                {
                    type: 'msline',
                    renderAt: 'chart-visit',
                    width: "100%",
                    dataFormat: 'json',
                    dataSource: []
                });
                conversionChart.render();
            })
            .finally(function()
            {
                $ionicLoading.hide();  
            });
        });
    }
    $scope.onSearchChange();
})
.controller('ActionVisitChartsCtrl', function($window,$timeout,$rootScope,$scope,$state,$ionicPopup,$ionicLoading,MenuService,ChartsSalesFac,StorageService) 
{

    var result = StorageService.get('chart-sale');
    $ionicLoading.show
    ({
      template: 'Loading...'
    })
    .then(function()
    {
        FusionCharts.ready(function() 
        {
            var dataSource;
            if(!result)
            {
                dataSource = [];
            }
            else
            {
                dataSource = result.ActionVisit;
            }
            var conversionChart = new FusionCharts(
            {
                type: 'mscolumn3d',
                renderAt: 'chart-actionvisit',
                width: "100%",
                dataFormat: 'json',
                dataSource: dataSource
            });
            conversionChart.render();
            $ionicLoading.hide();
        });  
    });
})
.controller('ActionVisitRequestChartsCtrl', function($window,$timeout,$rootScope,$scope,$state,$ionicPopup,$ionicLoading,MenuService,ChartsSalesFac,StorageService) 
{

    $ionicLoading.show
    ({
        template: 'Loading...'
    })
    .then(function()
    {
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
          $ionicLoading.hide();
        });   
    });
})
.controller('ActionVisitSellOutChartsCtrl', function($window,$timeout,$rootScope,$scope,$state,$ionicPopup,$ionicLoading,MenuService,ChartsSalesFac,StorageService) 
{
    $ionicLoading.show
    ({
        template: 'Loading...'
    })
    .then(function()
    {
        var result = StorageService.get('chart-sale');
        FusionCharts.ready(function() 
        {
          var conversionChart = new FusionCharts(
          {
            type: 'mscolumn3d',
            renderAt: 'chart-actionvisitsellout',
            width: "100%",
            dataFormat: 'json',
            dataSource: result.ActionVisitSellout
          });
          conversionChart.render();
          $ionicLoading.hide();
        });   
    });
})
.controller('ActionVisitMemoChartsCtrl', function($window,$timeout,$filter,$rootScope,$scope,$state,$ionicPopup,$ionicLoading,MenuService,ChartsSalesFac,StorageService,SalesMemoFac) 
{
    var tanggalplan = $filter('date')(new Date(),'yyyy-MM-dd');
    var firstDay            = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    var lastDay             = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);
    $scope.exampleForm      = {valuestart:firstDay,valueend:lastDay};
    $scope.onSearchChange = function()
    {
        var tglstart    = $filter('date')($scope.exampleForm.valuestart,'yyyy-MM-dd');
        var tglend      = $filter('date')($scope.exampleForm.valueend,'yyyy-MM-dd');
        $ionicLoading.show
        ({
            template: 'Loading...'
        })
        .then(function()
        {
            SalesMemoFac.GetMemoByDate(tglstart,tglend)
            .then(function (response)
            {
                $scope.actionmemos = response;
            },
            function(error)
            {
                console.log(error);
            })
            .finally(function()
            {
                $ionicLoading.show({template: 'Loading...',duration: 500});
                $scope.$broadcast('scroll.refreshComplete'); 
            });
        });
    }
    $scope.onSearchChange();

    $scope.SubmitForm = function(exampleForm)
    {
        var start       = exampleForm.valuestart;
        var end         = exampleForm.valueend;
        if(start > end)
        {
            alert("Tanggal End Harus Lebih Besar Dari Tanggal Start");
        }
        else
        {
            $scope.onSearchChange();  
        }
    }
})

.controller('ActionVisitKpiCtrl', function($window,$timeout,$rootScope,$scope,$state,$ionicPopup,$ionicLoading,MenuService,ChartsSalesFac,StorageService,UtilService) 
{
    ChartsSalesFac.GetSalesmans()
    .then(function (response)
    {
        $scope.salesmans = UtilService.ArrayChunk(response,4);
    }).
    finally(function()
    {
        $ionicLoading.hide();
    });

})

.controller('ActionVisitKpiDetailChartsCtrl', function($window,$filter,$stateParams,$timeout,$rootScope,$scope,$state,$ionicPopup,$ionicLoading,MenuService,ChartsSalesFac,StorageService) 
{
    var ID                  = $stateParams.id;
    var firstDay            = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    var lastDay             = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);
    $scope.exampleForm      = {valuestart:firstDay,valueend:lastDay};
    $scope.onSearchChange = function()
    {
        var tglstart    = $filter('date')($scope.exampleForm.valuestart,'yyyy-MM-dd');
        var tglend      = $filter('date')($scope.exampleForm.valueend,'yyyy-MM-dd');
        $ionicLoading.show
        ({
          template: 'Loading...'
        })
        .then(function()
        {
            ChartsSalesFac.GetSalesmansPerUser(tglstart,tglend,ID)
            .then(function (response)
            {
                FusionCharts.ready(function() 
                {
                    var conversionChart = new FusionCharts(
                    {
                        type: 'mscolumn3d',
                        renderAt: 'chart-actionvisitsellout',
                        width: "100%",
                        dataFormat: 'json',
                        dataSource: response.CustomerCall
                    });
                    conversionChart.render();

                    var analysisChart = new FusionCharts(
                    {
                        type: 'mscolumn3d',
                        renderAt: 'chart-effectivecall',
                        width: '100%',
                        dataFormat: 'json',
                        dataSource: response.EffectiveCall
                    });
                    analysisChart.render();

                    var newCustomersChart = new FusionCharts(
                    {
                        type: 'mscolumn3d',
                        renderAt: 'chart-newcustomer',
                        width: '100%',
                        dataFormat: 'json',
                        dataSource: response.NewCustomer
                    });
                    newCustomersChart.render();

                    var jumlahKunjunganAChart = new FusionCharts(
                    {
                        type: 'column3d',
                        renderAt: 'chart-jumlahkunjunganlayera',
                        width: '100%',
                        dataFormat: 'json',
                        dataSource: response.JumlahKunjunganLayerA
                    });
                    jumlahKunjunganAChart.render();

                    var jumlahKunjunganBChart = new FusionCharts(
                    {
                        type: 'column3d',
                        renderAt: 'chart-jumlahkunjunganlayerb',
                        width: '100%',
                        dataFormat: 'json',
                        dataSource: response.JumlahKunjunganLayerB
                    });
                    jumlahKunjunganBChart.render();
                });
            },
            function(error)
            {
                FusionCharts.ready(function() 
                {
                    var conversionChart = new FusionCharts(
                    {
                        type: 'mscolumn3d',
                        renderAt: 'chart-actionvisitsellout',
                        width: "100%",
                        dataFormat: 'json',
                        dataSource: []
                    });
                    conversionChart.render();

                    var analysisChart = new FusionCharts(
                    {
                        type: 'mscolumn3d',
                        renderAt: 'chart-effectivecall',
                        width: '100%',
                        dataFormat: 'json',
                        dataSource: []
                    });
                    analysisChart.render();

                    var newCustomersChart = new FusionCharts(
                    {
                        type: 'mscolumn3d',
                        renderAt: 'chart-newcustomer',
                        width: '100%',
                        dataFormat: 'json',
                        dataSource: []
                    });
                    newCustomersChart.render();

                    var jumlahKunjunganChart = new FusionCharts(
                    {
                        type: 'column3d',
                        renderAt: 'chart-jumlahkunjungan',
                        width: '100%',
                        dataFormat: 'json',
                        dataSource: []
                    });
                    jumlahKunjunganChart.render();
                });
            }).
            finally(function()
            {
                $ionicLoading.hide();
            });
        });
    }
    $scope.onSearchChange();
    $scope.SubmitForm = function(exampleForm)
    {
        var start       = exampleForm.valuestart;
        var end         = exampleForm.valueend;
        if(start > end)
        {
            alert("Tanggal End Harus Lebih Besar Dari Tanggal Start");
        }
        else
        {
            $scope.onSearchChange();  
        }
    }
});

