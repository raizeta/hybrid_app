'use strict';
myAppModule.controller("DBLocalController", ["$q","$rootScope","$scope", "$location","$http","auth","$window","apiService","ngToast","sweet","$filter","$timeout","$cordovaSQLite", 
function ($q,$rootScope,$scope, $location, $http,auth,$window,apiService,ngToast,sweet,$filter,$timeout,$cordovaSQLite) 
{   
    $scope.activedblocal = "active";
    $scope.loading  = true;
    $scope.userInfo = auth;
    $scope.logout = function () 
    { 
        $scope.userInfo = null;
        $window.sessionStorage.clear();
        window.location.href = "index.html";
    }

    $scope.submitForm = function(formsalesmanmemo)
    {
        var newMessage       = formsalesmanmemo.ISI_MESSAGES;
        $cordovaSQLite.execute($rootScope.db, 'INSERT INTO Messages (message) VALUES (?)', [newMessage])
        .then(function(result) 
        {
            alert("Message saved successful, cheers!");
            $scope.load();
            $scope.salesmanmemo.ISI_MESSAGES = '';
        }, 
        function(error) 
        {
            alert("Error on saving: " + error.message);
        });
    }

    $scope.load = function() 
    {

        $cordovaSQLite.execute($rootScope.db, 'SELECT * FROM Messages ORDER BY id DESC')
        .then(function(result) 
        {
            alert("Data Sukses Load");
            var salesmanmemo = [];
            if (result.rows.length > 0) 
            {
                var l = result.rows.length;
                for (var i=0; i < l; i++) 
                {
                    var detail = {};
                    detail.id       = result.rows.item(i).id;
                    detail.messages = result.rows.item(i).message;
                    salesmanmemo.push(detail);
                }
            }
            $scope.salesmanmemos = salesmanmemo;
        },
        function(error) 
        {
            alert("Error on loading: " + error.message);
        });
    }
    $scope.load();
}]);




