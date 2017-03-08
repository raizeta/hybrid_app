angular.module('starter')
.service('MenuService', function($q, $http) 
{
    var ChartsMenu = function()
    {
      var chartsmenu = [];
      chartsmenu.push({link:"#/main/dashboard",judul:"Grand Dash"});
      chartsmenu.push({link:"#/main/charts",judul:"Charts Dash"});
      chartsmenu.push({link:"#/main/products",judul:"Products"});
      chartsmenu.push({link:"#/main/customers",judul:"Customers"});
      chartsmenu.push({link:"#/main/supliers",judul:"Supliers"});
      chartsmenu.push({link:"#/main/purchases",judul:"Purchases"});
      chartsmenu.push({link:"#/main/sales",judul:"Sales"});
      chartsmenu.push({link:"#/main/spg",judul:"SPG"});
      return chartsmenu;
    }

    var DashboardMenu = function()
    {
      var dashboardmenu = [];
      dashboardmenu.push({link:"#/main/dashboard",judul:"Grand Dash"});
      dashboardmenu.push({link:"#/main/charts",judul:"Charts Dash"});
      dashboardmenu.push({link:"#/main/po/inbox",judul:"PO Dash"});
      dashboardmenu.push({link:"#/main/ba/inbox",judul:"BA Dash"});
      return dashboardmenu;
    }
    return {
      ChartsMenu:ChartsMenu,
      DashboardMenu:DashboardMenu
    };
});