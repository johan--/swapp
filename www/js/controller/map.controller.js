(function() {
    'use strict';

    var app = angular.module('starter.controller');

    /**
     * Controller para a view do mapa
     */
    app.controller('MapController',[
        '$scope',
        '$state',
        '$ionicModal',
        '$ionicPopover',
        'MapService',
        'UserService',
        'UI', function($scope, $state, $ionicModal, $ionicPopover, MapService, UserService, UI) {

        // dados que irao existir neste contexto
        $scope.data = {
            tempo: 5
        };

        /**
         * Realiza a linkagem entre o scope
         * do controller e do modal e instancia
         * no escopo o modal.
         */
        $ionicModal.fromTemplateUrl("templates/seeswap.html", {
            scope: $scope
        }).then(function (modal) {
            $scope.modal = modal;
        });

        /**
         * Realiza a linkagem entre o scope
         * do controller e do popover e instancia
         * no escopo o popover.
         */
        $ionicPopover.fromTemplateUrl('templates/map-popover.html', {
            scope: $scope
        }).then(function(popover) {
            $scope.popover = popover;
        });

        /**
         * Adiciona ao scope a
         * funçao de obter o mapa.
         */
        $scope.mapa = function() {
            return MapService.getMapa();
        };

        /**
         * Acao disparada quando o usuario quer
         * oferecer a vaga
         */
        $scope.givePlace = function() {
           getConfirmarVaga().then(function(answer) {
                if (answer) {
                    getConfirmarTempo().then(function(answer) {
                       if (answer) {
                           MapService.givePlace($scope.data.tempo);
                       }
                    });
                }
            });
        };

        /**
         * Obtem o popup para confirmar o
         * envio de vaga.
         */
        function getConfirmarVaga() {
            var config = {
                title: 'Disponibilizar vaga',
                template: 'Você vai realmente disponibilizar sua vaga?',
                cancelText: 'Não',
                okText: 'Sim',
                okType: 'button-assertive'
            };
            return UI.showPopupConfig(config);
        };

        /**
         * Obtem o popup para o usuario
         * colocar os minutos que ira liberar a vaga.
         */
        function getConfirmarTempo() {
            var config = {
                title: 'Tempo de espera',
                templateUrl: 'templates/tempo-vaga.html',
                okText: 'Ok',
                okType: 'button-assertive',
                scope: $scope
            };
            return UI.showPopupConfig(config);
        };

        /**
         * Listener para quando o usuario selecionar um marker.
         * Quando clicado, mostrara um botao para
         */
        $scope.$on("leafletDirectiveMarker.click", function(event, args){
            var idMarker = args.markerName;
            if (idMarker !== "user") {
                var swaps = MapService.getSwaps();

                $scope.swap = swaps[idMarker];
                $scope.swap.time = new Date($scope.swap.time);
                $scope.showInfo = true;
            }
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
            $scope.popover.hide();
            MapService.plotMarkers();
        };

        /**
         * Localiza o usuario.
         */
        $scope.locate = function() {
            $scope.popover.hide();
            MapService.updateLocation();
        };

        /**
         * Funcao a ser chamada quando o usuario
         * quer a vaga.
         */
        $scope.getSwap = function() {
            $scope.modal.hide();
            MapService.takeSwap($scope.swap);
        };

        /**
         * Açao ao clicar no botao more-vertical
         *
         * @param $event evento acionado
         * pelo usuario
         */
        $scope.openPopover = function($event) {
            $scope.popover.show($event);
        };

        $scope.carregarSwap = function() {
            UI.showLoading('Carregando dados...');
            var intervalo = $scope.swap.intervalo;
            $scope.swap.intervalo = new Date($scope.swap.time);
            $scope.swap.intervalo.setMinutes($scope.swap.intervalo.getMinutes() + intervalo);

            UserService.getById($scope.swap.user).then(function(info) {
                UI.hideLoading();
                $scope.swap.user = info.data;
            }, function(error) {
                UI.hideLoading();
                UI.showPopup("Nao foi possivel carregar os dados");
            });
        };
    }]);
}());