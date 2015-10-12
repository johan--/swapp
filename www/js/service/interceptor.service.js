(function() {
    'use strict';

    var app = angular.module('starter.service');

    /**
     * Interceptador de requisicoes.
     * Adiciona o token de autenticacao.
     */
    app.service('Interceptor',[function() {
        var self = this;

        this.request = function(config) {
            config.headers['x-access-token'] = sessionStorage.token;
            return config;
        };
    }]);
})();