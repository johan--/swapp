angular.module('starter.controller', []);
angular.module('starter.service', []);
angular.module('starter.factory', []);

var app = angular.module('starter', ['ionic', 'starter.controller', 'starter.service', 'leaflet-directive', 'ngCordova', 'igTruncate']);

app.run(function($ionicPlatform, Auth, $rootScope, $state) {
    $ionicPlatform.ready(function() {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            window.cordova.plugins.Keyboard.disableScroll(true);
        }
        if (window.StatusBar) {
            StatusBar.styleDefault();
        }
    });

    $rootScope.$on("$stateChangeSuccess", function(event, toState, toParams, fromState, fromParams){
        var isAuthRequired = toState.authRequired;
        isAuthRequired = isAuthRequired === undefined ? toState.views.menuContent.authRequired : isAuthRequired;

        if (isAuthRequired && !Auth.isAutenticado()) {
            $state.transitionTo('login');
            event.preventDefault();
        }
    });
});

app.constant('ApiEndpoint', {
    url: 'http://localhost:8100/api'
});

app.config(function($stateProvider, $urlRouterProvider) {
    $stateProvider

    .state('login', {
        url: "/login",
        templateUrl: "templates/login.html",
        controller: "LoginController",
        authRequired: false
    })

    .state('signup', {
        url: "/signup",
        templateUrl: "templates/signup.html",
        controller: "LoginController",
        authRequired: false
    })

    .state('app', {
        url: "/app",
        abstract: true,
        templateUrl: "templates/menu.html",
        controller: "MenuController as menuCtrl",
        authRequired: true
    })

    .state('app.map', {
        url: "/map",
        views: {
          'menuContent' :{
            templateUrl: "templates/map.html",
            controller: "MapController as mapCtrl",
            authRequired: true
          }
        }
    })

    .state('app.config', {
        url: "/config",
        views: {
            'menuContent' :{
                templateUrl: "templates/config.html",
                controller: "ConfigController as configCtrl",
                authRequired: true
            }
        }
    })

    .state('app.bug', {
        url: "/bug",
        views: {
            'menuContent' :{
                templateUrl: "templates/bug.html",
                controller: "BugController as bugCtrl",
                authRequired: true
            }
        }
    })

    $urlRouterProvider.otherwise('/login');

});