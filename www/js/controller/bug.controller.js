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

        // tipos que podem ser selecionados na view
        $scope.tipos = [
          'Critico',
            'Leve'
        ];

        // Bug que esta sendo cadastrado no momento
        $scope.bug = {};

        /**
         * Envia o cadastro de Bug para o servidor.
         */
        $scope.send = function() {
            Bug.save($scope.bug).then(function(info) {
                var message = 'Obrigado! Iremos melhorar  =)';
                UI.showPopup(message).then(function() {
                    $state.go('app.map');
                })
            }, function(err) {
                var message = 'Nao foi possivel enviar o bug. Tente novamente mais tarde';
                UI.showPopup(message);
            });
        };
    }]);
}());