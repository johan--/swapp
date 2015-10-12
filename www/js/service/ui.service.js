(function() {
    'use strict';

    var app = angular.module('starter.service');

    /**
     * TODO remover todas as injecoes de Auth
     * para o UserService e prover a interface
     * para este service.
     *
     * Alterar para o UserService prover a
     * interface do MapService tbm
     *
     */

    /**
     * Service para utilidades da UI.
     * Prove uma unificacao no uso dos componentes.
     */
    app.service('UI',  ['$ionicPopup', '$ionicModal', '$ionicLoading', function($ionicPopup, $ionicModal, $ionicLoading) {
        var self = this;

        this.showPopup = function(message) {
            var popup = $ionicPopup.alert({
                title: message
            });
            return popup;
        };

        this.showPopupConfig = function(config) {
            var popup = $ionicPopup.confirm(config);
            return popup;
        };

        this.showLoading = function(message) {
            $ionicLoading.show({
                template: message
            });
        };

        this.hideLoading = function() {
            $ionicLoading.hide();
        };
    }]);
}());