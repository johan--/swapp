(function() {
    'use strict';

    var app = angular.module('starter.controller');

    /**
     * Controller para a view de cadastro de bug.
     */
    app.controller('BugController', [
        '$scope',
        '$state',
        'Bug',
        'UI', function($scope, $state, Bug, UI) {

        // Bug que esta sendo cadastrado no momento
        $scope.bug = {};

        /**
         * Envia o cadastro de Bug para o servidor.
         */
        $scope.send = function() {
            UI.showLoading("Enviando...");
            Bug.save($scope.bug).then(function(info) {
                UI.hideLoading();
                var message = 'Obrigado! Iremos melhorar  =)';
                UI.showPopup(message);
                $scope.bug = {};
            }, function(err) {
                UI.hideLoading();
                var message = 'Nao foi possivel enviar o bug. Tente novamente mais tarde';
                UI.showPopup(message);
            });
        };
    }]);
}());