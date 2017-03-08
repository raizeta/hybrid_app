angular.module('starter')
.config(function ($stateProvider, $urlRouterProvider,$ionicConfigProvider,$httpProvider)
{
    $stateProvider.state('main.ba', 
    {
      url: '/ba',
      abstract:true,
      views: 
      {
          'ba-tab': 
          {
            templateUrl: 'apps/a_beritaacara/views/ba.html',
            controller:'BaCtrl'
          }
      }
    });
    $stateProvider.state('main.ba.inbox', 
    {
          url: "/inbox",
          views: {
              'ba-inbox': {
                  templateUrl: "apps/a_beritaacara/views/ba-inbox.html",
                  controller:'BaInboxCtrl'
              }
          }
    });
    $stateProvider.state('main.ba.inboxdetail', 
    {
          url: "/inboxdetail/:id",
          views: {
              'ba-inbox': {
                  templateUrl: "apps/a_beritaacara/views/ba-inbox-detail.html",
                  controller:'BaInboxDetailCtrl'
              }
          }
    });
    $stateProvider.state('main.ba.outbox', 
    {
          url: "/outbox",
          views: {
              'ba-outbox': {
                  templateUrl: "apps/a_beritaacara/views/ba-outbox.html",
                  controller:'BaOutboxCtrl'
              }
          }
    });
    $stateProvider.state('main.ba.outboxdetail', 
    {
          url: "/outboxdetail/:id",
          views: {
              'ba-outbox': {
                  templateUrl: "apps/a_beritaacara/views/ba-outbox-detail.html",
                  controller:'BaOutboxDetailCtrl'
              }
          }
    });
    $stateProvider.state('main.ba.history', 
    {
          url: "/history",
          views: {
              'ba-history': {
                  templateUrl: "apps/a_beritaacara/views/ba-history.html",
                  controller:'BaHistoryCtrl'
              }
          }
    });
    $stateProvider.state('main.ba.historydetail', 
    {
          url: "/historydetail/:id",
          views: {
              'ba-history': {
                  templateUrl: "apps/a_beritaacara/views/ba-history-detail.html",
                  controller:'BaHistoryDetailCtrl'
              }
          }
    });
});