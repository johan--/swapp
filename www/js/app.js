angular.module('starter.controller', []);
angular.module('starter.service', []);
angular.module('starter.factory', []);

var app = angular.module('starter',
    ['ionic',
        'starter.controller',
        'starter.service',
        'starter.factory',
        'leaflet-directive',
        'ngCordova',
        'igTruncate'
    ]);

app.run(function($ionicPlatform, Auth, $rootScope, $state, $ionicPopup) {
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

    // verificar aqui se gps e net estao habilitados

    /**
     * Aqui contem a logica para quando houver o roteamento
     * entre as views determinar se esta sendo autenticado.
     */
    $rootScope.$on("$stateChangeStart", function(event, toState, toParams, fromState, fromParams){
        var isAuthRequired = toState.authRequired;
        isAuthRequired = isAuthRequired === undefined ? toState.views.menuContent.authRequired : isAuthRequired;

        if (isAuthRequired && !Auth.isAutenticado()) {
            $state.transitionTo('login');
            event.preventDefault();
        }

        // apenas em dispositivos eh detectado a rede
        if (window.Connection) {
            if (navigator.connection.type == Connection.NONE) {
                $ionicPopup.confirm({
                    title: "Internet Disconnected",
                    content: "The internet is disconnected on your device."
                }).then(function(result) {
                    if (!result) {
                        ionic.Platform.exitApp();
                    }
                });
            }
        }
    });
});

/**
 * Constante para acesso a API REST
 */
app.constant('ApiEndpoint', {
    url: 'http://localhost:8100/api'
});

/**
 * Configuracao de roteamento. Ver angular-ui-router
 */
app.config(function($stateProvider, $urlRouterProvider, $httpProvider) {
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

    // caso nao seja definido o estado. Vai para este.
    $urlRouterProvider.otherwise( function($injector, $location) {
        var $state = $injector.get("$state");
        $state.go("app.map");
    });

    // interceptador das requisicoes. Adiciona o token ao request, por exemplo.
    $httpProvider.interceptors.push('Interceptor');
});