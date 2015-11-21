(function() {
    'use strict';

    var app = angular.module('starter.service');

    app.service('GpsService', ['$cordovaGeolocation',function($cordovaGeolocation) {
        var service = {};

        var config = {
            frequency : 1000,
            enableHighAccuracy: false,
            timeout: 10000, // tempo limite de espera do GPS, caso contrario, chama callbackError
            maximumAge: 0
        };

        service.geolocation = function(callbackSucess, callbackError) {
            $cordovaGeolocation.getCurrentPosition(config)
                .then(callbackSucess, callbackError);
        };

        return service;
    }]);
})();