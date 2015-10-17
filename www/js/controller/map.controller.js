(function() {
    'use strict';

    var app = angular.module('starter.controller');

    /**
     * Controller para a view do mapa
     */
    app.controller('MapController',[
        '$scope',
        '$state',
        'MapService',
        'UserService',
        'UI', function($scope, $state, MapService, UserService, UI) {

        $scope.mapa = function() {
            return MapService.getMapa();
        };

        /**
         * Acao disparada quando o usuario quer
         * oferecer a vaga
         */
        $scope.givePlace = function() {
            var config = {
                title: 'Disponibilizar vaga',
                template: 'Você vai realmente disponibilizar sua vaga?',
                cancelText: 'Não',
                okText: 'Sim'
            };
            UI.showPopupConfig(config).then(function(answer) {
                if (answer) {
                    MapService.givePlace();
                }
            });
        };

        /**
         * Carrega as vagas de estacionamento.
         */
        $scope.loadSwaps = function() {
            MapService.plotMarkers();
        };

        /**
         * Localiza o usuario.
         */
        $scope.locate = function() {
            MapService.updateLocation();
            MapService.takeSwap();
        };
    }]);
}());