angular.module('starter')
.config(function ($stateProvider, $urlRouterProvider,$ionicConfigProvider,$httpProvider)
{
    $stateProvider.state('main.po', 
    {
      url: '/po',
      abstract:true,
      views: 
      {
          'po-tab': 
          {
            templateUrl: 'apps/a_purchase/views/po.html',
            controller:'PurchaseCtrl'
          }
      }
    });
    $stateProvider.state('main.po.inbox', 
    {
          url: "/inbox",
          views: {
              'po-inbox': {
                  templateUrl: "apps/a_purchase/views/po-inbox.html",
                  controller:'PurchaseInboxCtrl'
              }
          },
          resolve: 
          {
            resPurchace: function ($stateParams,$q,PurchaseFac) 
            {
                
                var KD_PO = $stateParams.id;
                var data  = PurchaseFac.SearchPurchases(101);
                if(data)
                {
                  return $q.when(data);
                }
            }
          }
    });
    $stateProvider.state('main.po.inboxdetail', 
    {
          url: "/inboxdetail/:id",
          views: {
              'po-inbox': {
                  templateUrl: "apps/a_purchase/views/po-inbox-detail.html",
                  controller:'PurchaseInboxDetailCtrl'
              },
          },
          resolve: 
          {
            resPurchaceList: function ($stateParams,$q,PurchaseDetailFac) 
            {
                
                var KD_PO = $stateParams.id;
                var data  = PurchaseDetailFac.SearchPurchaseDetails(KD_PO);
                if(data)
                {
                  return $q.when(data);
                }
            }
          }
    });
    $stateProvider.state('main.po.accept', 
    {
          url: "/accept",
          views: {
              'po-accept': {
                  templateUrl: "apps/a_purchase/views/po-accept.html",
                  controller:'PurchaseAcceptCtrl'
              }
          },
          resolve: 
          {
            resPurchace: function ($stateParams,$q,PurchaseFac) 
            {
                
                var KD_PO = $stateParams.id;
                var data  = PurchaseFac.SearchPurchases(107);
                if(data)
                {
                  return $q.when(data);
                }
            }
          }
    });
    $stateProvider.state('main.po.acceptdetail', 
    {
          url: "/acceptdetail/:id",
          views: {
              'po-accept': {
                  templateUrl: "apps/a_purchase/views/po-accept-detail.html",
                  controller:'PurchaseAcceptDetailCtrl'
              }
          },
          resolve: 
          {
            resPurchaceList: function ($stateParams,$q,PurchaseDetailFac) 
            {
                
                var KD_PO = $stateParams.id;
                var data  = PurchaseDetailFac.SearchPurchaseDetails(KD_PO);
                if(data)
                {
                  return $q.when(data);
                }
            }
          }
    });
    $stateProvider.state('main.po.reject', 
    {
          url: "/reject",
          views: {
              'po-reject': {
                  templateUrl: "apps/a_purchase/views/po-reject.html",
                  controller:'PurchaseRejectCtrl'
              }
          },
          resolve: 
          {
            resPurchace: function ($stateParams,$q,PurchaseFac) 
            {
                
                var KD_PO = $stateParams.id;
                var data  = PurchaseFac.SearchPurchases(108);
                if(data)
                {
                  return $q.when(data);
                }
            }
          }
    });
    $stateProvider.state('main.po.rejectdetail', 
    {
          url: "/rejectdetail/:id",
          views: {
              'po-reject': {
                  templateUrl: "apps/a_purchase/views/po-reject-detail.html",
                  controller:'PurchaseRejectDetailCtrl'
              }
          },
          resolve: 
          {
            resPurchaceList: function ($stateParams,$q,PurchaseDetailFac) 
            {
                
                var KD_PO = $stateParams.id;
                var data  = PurchaseDetailFac.SearchPurchaseDetails(KD_PO);
                if(data)
                {
                  return $q.when(data);
                }
            }
          }
    });
    $stateProvider.state('main.po.progress', 
    {
          url: "/progress",
          views: {
              'po-progress': {
                  templateUrl: "apps/a_purchase/views/po-progress.html",
                  controller:'PurchaseProgressCtrl'
              }
          },
          resolve: 
          {
            resPurchace: function ($stateParams,$q,PurchaseFac) 
            {
                
                var KD_PO = $stateParams.id;
                var data  = PurchaseFac.SearchPurchases(108);
                if(data)
                {
                  return $q.when(data);
                }
            }
          }
    });
    $stateProvider.state('main.po.progressdetail', 
    {
          url: "/progressdetail/:id",
          views: {
              'po-progress': {
                  templateUrl: "apps/a_purchase/views/po-progress-detail.html",
                  controller:'PurchaseProgressDetailCtrl'
              }
          },
          resolve: 
          {
            resPurchaceList: function ($stateParams,$q,PurchaseDetailFac) 
            {
                
                var KD_PO = $stateParams.id;
                var data  = PurchaseDetailFac.SearchPurchaseDetails(KD_PO);
                if(data)
                {
                  return $q.when(data);
                }
            }
          }
    });
});