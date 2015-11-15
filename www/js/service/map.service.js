(function() {
    'use strict';

    var app = angular.module('starter.service');

    /**
     * Service contendo as logicas de manipulacoes com o mapa.
     */
    app.service('MapService',[
        '$cordovaGeolocation',
        'UserService',
        'leafletData',
        'UI', function($cordovaGeolocation, UserService, leafletData, UI) {

            // objeto do service
            var service = {};

            // mapa que esta sendo
            self.mapa = undefined;

            // vagas disponiveis no mapa
            var swaps = {};

            /**
             * Obtem o mapa configurado.
             *
             * @returns  o mapa com suas configuracoes
             */
            service.getMapa = function() {
                if (self.mapa === undefined) {
                    self.mapa = makeMap();
                    service.updateLocation();
                    service.plotMarkers();
                }

                return self.mapa;
            };

            /**
             * Constroi uma nova instancia do mapa.
             *
             * @return um novo mapa.
             */
            function makeMap() {
                return {
                    defaults: {
                        tileLayer: 'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
                            maxZoom: 18,
                            zoomControlPosition: 'bottomleft'
                    },
                    markers: {},
                    events: {
                        map: {
                            enable: ['context'],
                                logic: 'emit'
                        }
                    },
                    center: {
                        lat : 0,
                            lng : 0,
                            zoom : 14
                    }
                };
            };

            /**
             * Reseta o mapa. Isto eh usado
             * para quando o usuario realizar o logout.
             */
            service.resetaMapa = function() {
                self.mapa = undefined;
            };

            /**
             * Chama a loca-lizacao via GPS.
             *
             * @param callbackSucess funcao a ser chamada em caso de sucesso
             * @param callbackError funcao a ser chamada em caso de erro
             */
            function geolocation(callbackSucess, callbackError) {
                var options = {
                    frequency : 1000,
                    enableHighAccuracy: true,
                    timeout: 10000, // tempo limite de espera do GPS, caso contrario, chama callbackError
                    maximumAge: 0
                };
                $cordovaGeolocation.getCurrentPosition(options)
                    .then(callbackSucess, callbackError);
            };

            /**
             * @return {Object} contendo os dados
             * do icone do marcador do mapa
             */
            function getFreeSwap() {
                var custom = {
                    iconUrl: 'img/vaga-livre.png',
                    iconAnchor:   [25, 50], // point of the icon which will correspond to marker's location
                    popupAnchor:  [3, -40] // point from which the popup should open relative to the iconAnchor
                };
                return custom;
            };

            /**
             * Feedback para quando o GPS nao funcionar.
             * Eh o callbackError do geolocation.
             */
            function feedbackGPSNotWorking(error) {
                UI.hideLoading();
                UI.showPopup('GPS not working');
            };

            /**
             * Alteracao a posiçao do mapa
             * onde esta sendo visualizado para uma
             * determinada posicao
             *
             * @param position {Object} posicao
             * de onde sera centralizado
             */
            function setCenter(position) {
                service.getMapa().center = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                    zoom: 15
                }
            };

            /**
             * Adiciona um marcador no mapa
             *
             * @param marker {Object} marker
             * do servidor
             */
            function addMarker(marker, custom) {
                // caso nao tenha _id, eh a posicao atual do usuario
                service.getMapa().markers[marker._id || 'user'] = {
                    lat: marker.latitude,
                    lng: marker.longitude,
                    message: marker.userName || 'Voce esta aqui',
                    focus: true,
                    draggable: false,
                    icon: custom
                };
            };

            /**
             * Encontra a posicao do usuario
             * e coloca no mapa
             */
            service.updateLocation = function() {
                UI.showLoading('Carregando');

                geolocation(function(position) {
                    setCenter(position);
                    var position = {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                    };
                    addMarker(position);
                    UI.hideLoading();
                }, feedbackGPSNotWorking);
            };

            /**
             * Funcao a ser chamada quando o usuario
             * quer fornecer uma vaga. Envia para o
             * servidor a disponibilidade.
             */
            service.givePlace = function() {
                UI.showLoading('Carregando localizacao...');

                geolocation(function(position) {
                    var swap = {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                        time: new Date()
                    };

                    UI.showLoading('Enviando vaga...');
                    UserService.sendPlace(swap).then(function(info) {
                        setCenter(position);
                        addMarker(info.data, getFreeSwap());
                        UI.hideLoading();
                    }, function(error) {
                        UI.hideLoading();
                        UI.showPopup('A vaga nao rolou =(');
                    });
                }, feedbackGPSNotWorking);
            };

            /**
             * Carrega e coloca no mapa as
             * vagas de estacionamento.
             */
            service.plotMarkers = function() {
                UI.showLoading('Requisitando vagas');

                if (!_.isUndefined(mapa.markers)
                    && !_.isNull(mapa.markers)) {
                    // limpa o mapa
                    mapa.markers = {};
                }
                UserService.getSwaps().then(function(info) {
                    swaps = {};
                    UI.showLoading('Carregando vagas');
                    for (var i = 0; i < info.data.length; i++) {
                        var swap = info.data[i];
                        addMarker(swap, getFreeSwap());
                        swaps[swap._id] = swap;
                    }
                    UI.hideLoading();
                }, function(error) {
                    UI.hideLoading();
                    UI.showPopup('Nao foi possivel carregar as vagas. Tente mais tarde   =(');
                });
            };

            /**
             * Retorna o conjunto de swap que
             * existem no mapa.
             *
             * @returns conjunto de swap
             */
            service.getSwaps = function() {
                return swaps;
            };

            /**
             * Realiza o match entre duas pessoas.
             * Uma que ofereceu a vaga e outra que esta querendo a
             * vaga.
             */
            service.takeSwap = function(swap) {
                UI.showLoading('Carregando localizacao');
                geolocation(function(position) {
                    var from = {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                        time: new Date()
                    };
                    UI.showLoading('Realizando roteamento');
                    leafletData.getMap('map').then(function(map) {
                        var routingMachine = new L.Routing.control({
                            serviceUrl: 'https://router.project-osrm.org/viaroute', // força o endereço correto no mobile
                            waypoints: [
                                L.latLng(castPrecision(from.latitude), castPrecision(from.longitude)),
                                L.latLng(castPrecision(swap.latitude), castPrecision(swap.longitude))
                            ]
                        });
                        map.addControl(routingMachine);
                        UI.hideLoading();
                    });
                }, feedbackGPSNotWorking);
            };

            /**
             * Realiza o cast das coordenadas. Necessario
             * porque o valor eh muito grande e interfere
             * da API das rotas do serviço.
             *
             * @param value coordenada
             * @returns {Number} coordenada formatada.
             */
            function castPrecision(value) {
                value = parseFloat(value).toFixed(6);
                return parseFloat(value);
            };

            return service;
        }]);
}());