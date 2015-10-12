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

        this.isAutenticado = function() {
          return !_.isNull(self.getToken())
              && !_.isUndefined(self.getToken());
        };

        this.setToken = function(info) {
            sessionStorage.setItem('token', info.data.token);
        };

        this.clear = function() {
          sessionStorage.removeItem('token');
        };

        this.logout = function() {
            var data = {
              token: self.getToken()
            };
            return $http.post(ApiEndpoint.url + '/api/authenticate/logout', data);
        };

        this.login = function(email, password) {
            var data = {
                email: email,
                password: password
            };
            return $http.post(ApiEndpoint.url + '/api/authenticate/login', data);
        };
    }]);
}());