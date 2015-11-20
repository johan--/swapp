(function() {
    'use strict';

    var app = angular.module('starter.service');

    /**
     * Service contendo a logica do usuario autenticado.
     * Prove informacoes de Autenticacao.
     */
    app.service('Auth', [
        '$http',
        'ApiEndpoint', function($http, ApiEndpoint) {

        var self = this;

        this.getToken = function() {
            return sessionStorage.getItem('token');
        };

        this.setToken = function(token) {
            sessionStorage.setItem('token', token);
        };

        this.isAutenticado = function() {
          return !_.isNull(self.getToken())
              && !_.isUndefined(self.getToken());
        };

        this.clear = function() {
            sessionStorage.removeItem('token');
            sessionStorage.removeItem('userId');
            sessionStorage.removeItem('device-token');
            sessionStorage.removeItem('push-token');
        };

        this.login = function(email, password) {
            var data = {
                email: email,
                password: password
            };
            return $http.post(ApiEndpoint.url + '/api/authenticate/login', data);
        };

        this.logout = function() {
            var data = {
              token: self.getToken()
            };
            return $http.post(ApiEndpoint.url + '/api/authenticate/logout', data);
        };

        this.getUserId = function() {
            return JSON.parse(sessionStorage.getItem('userId')).id;
        };

        this.setUserId = function(userId) {
            sessionStorage.setItem('userId', JSON.stringify({id: userId}));
        };
    }]);
}());