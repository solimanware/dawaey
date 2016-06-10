// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'angular.filter', 'starter.controllers','starter.services'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

    .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })

  .state('app.intro', {
    url: '/intro',
    views: {
      'menuContent': {
        templateUrl: 'templates/intro.html',
        controller: 'IntroCtrl'
      }
    }
  })
    .state('app.main', {
      url: '/main',
      views: {
        'menuContent': {
          templateUrl: 'templates/main.html',
          controller: 'MainCtrl'
        }
      }
    })
    .state('app.quick', {
      url: '/quick',
      views: {
        'menuContent': {
          templateUrl: 'templates/quick.html',
          controller: 'QuickCtrl'
        }
      }
    })
    .state('app.drug', {
      url: '/drug/:drugId',
      views: {
        'menuContent': {
          templateUrl: 'templates/drug.html',
          controller: 'DrugCtrl'
        }
      }
    })
    .state('app.trade', {
      url: '/trade',
      views: {
        'menuContent': {
          templateUrl: 'templates/trade.html',
          controller: 'QuickCtrl'
        }
      }
    })
    .state('app.chname', {
      url: '/chname',
      views: {
        'menuContent': {
          templateUrl: 'templates/chname.html',
          controller: 'QuickCtrl'
        }
      }
    })
    .state('app.price', {
      url: '/price',
      views: {
        'menuContent': {
          templateUrl: 'templates/price.html',
          controller: 'QuickCtrl'
        }
      }
    })
    .state('app.company', {
      url: '/company',
      views: {
        'menuContent': {
          templateUrl: 'templates/company.html',
          controller: 'QuickCtrl'
        }
      }
    })
    .state('app.approximate', {
      url: '/approximate',
      views: {
        'menuContent': {
          templateUrl: 'templates/approximate.html',
          controller: 'QuickCtrl'
        }
      }
    })
    .state('app.partners', {
      url: '/partners',
      views: {
        'menuContent': {
          templateUrl: 'templates/partners.html',
          controller: 'PartenersCtrl'
        }
      }
    })
    .state('app.sponsors', {
      url: '/sponsors',
      views: {
        'menuContent': {
          templateUrl: 'templates/sponsors.html',
          controller: 'SponsorsCtrl'
        }
      }
    })
    .state('app.developer', {
      url: '/developer',
      views: {
        'menuContent': {
          templateUrl: 'templates/developer.html',
          controller: 'DeveloperCtrl'
        }
      }
    });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/intro');
});
