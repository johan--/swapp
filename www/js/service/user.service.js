(function() {
    'use strict';

    var app = angular.module('starter.service');

    /**
     * Service do usuario.
     */
    app.service('UserService',[
        '$http',
        'ApiEndpoint',
        'Auth', function($http, ApiEndpoint, Auth) {
        var service = {};

        var url = "/api/user";

        service.save = function(data) {
            return $http.post(ApiEndpoint.url +  url, data);
        };

        service.update = function(data) {
            return $http.put(ApiEndpoint.url + url, data);
        };

        service.login = function(email, password) {
            var data = {
                email: email,
                password: password
            };
            return $http.post(ApiEndpoint.url + '/api/authenticate', data);
        };

        service.sendPlace = function(data) {
            return $http.post(ApiEndpoint.url + '/api/swap', data);
        };

        service.getSwaps = function() {
            return $http.get(ApiEndpoint.url + '/api/swap');
        };

        service.isAutenticado = function() {
            return Auth.isAutenticado();
        };

        return service;
    }]);
}());