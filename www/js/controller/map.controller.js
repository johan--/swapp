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
         * Listener para quando o usuario selecionar um marker.
         * Quando clicado, mostrara um botao para
         */
        $scope.$on("leafletDirectiveMarker.click", function(event, args){
            var idMarker = args.markerName;
            var swaps = MapService.getSwaps();

            $scope.swap = swaps[idMarker];
            $scope.showInfo = true;
        });

        /**
         * Listener para quando usuario mover o mapa.
         * Isto quer dizer que ele nao estah mais
         * selecionando o marker.
         */
        $scope.$on('leafletDirectiveMap.drag', function(event){
            $scope.showInfo = false;
            $scope.swap = undefined;
        });

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
        };

        /**
         * TODO Exibir o modal de selecionar vaga.
         */
        $scope.swapInfo = function() {
            console.log('mostrar modal');
            console.log($scope.swap);
            MapService.takeSwap($scope.swap);
        };
    }]);
}());