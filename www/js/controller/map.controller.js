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

        /**
         * Quando a view eh carregada, o mapa
         * sera construido. Caso contrario,
         * haverao erros.
         */
        $scope.$on("$stateChangeSuccess", function() {

        });

        $scope.mapa = function() {
            return MapService.getMapa();
        };

        /**
         * Constroi o mapa da view
         *
         * @return {Object} mapa do leafletjs
         */
        function configurarMapa() {
            var mapa = {
                defaults: {
                    tileLayer: 'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
                    maxZoom: 18,
                    zoomControlPosition: 'bottomleft'
                },
                markers : {},
                events: {
                    map: {
                        enable: ['context'],
                        logic: 'emit'
                    }
                },
                center: {
                    lat : 0,
                    lng : 0,
                    zoom : 12
                }
            };
            return mapa;
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
                    MapService.givePlace($scope.map);
                }
            });
        };

        $scope.loadSwaps = function() {
            MapService.plotMarkers($scope.map);
        };
    }]);
}());