angular.module('starter')
.config(function ($stateProvider, $urlRouterProvider,$ionicConfigProvider,$httpProvider)
{
    $stateProvider.state('main.foodtown', 
    {
        url: '/foodtown',
        abstract:true,
        views: 
        {
            'foodtown-tab': 
            {
              templateUrl: 'apps/a_foodtown/views/main.html',

            }
        }
    });
    $stateProvider.state('main.foodtown.sale', 
    {
        url: "/sale",
        views: 
        {
            'foodtown-sale': 
            {
                templateUrl: "apps/a_foodtown/views/sale.html",
                controller:'FoodtownSaleCtrl'
            }
        }
    });
    $stateProvider.state('main.foodtown.tenant', 
    {
        url: "/tenant",
        views: 
        {
            'foodtown-tenant': 
            {
              templateUrl: "apps/a_foodtown/views/tenant.html",
              controller:'FoodtownTenantCtrl'
            }
        }
    });
    $stateProvider.state('main.foodtown.member', 
    {
        url: "/member",
        views: 
        {
            'foodtown-member': 
            {
              templateUrl: "apps/a_foodtown/views/member.html",
              controller:'FoodtownMemberCtrl'
            }
        }
    });

});