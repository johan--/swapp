(function() {
	'use strict';

	var app = angular.module('starter.service');

    /**
     * Service contendo as logicas de manipulacoes com o mapa.
     */
	app.service('MapService',[
        '$cordovaGeolocation',
        '$ionicLoading',
        'UserService',
        'UI', function($cordovaGeolocation, $ionicLoading, UserService, UI) {

		var service = {};

        self.mapa = undefined;

        /**
         * Obtem o mapa configurado.
         *
         * @returns  o mapa com suas configuracoes
         */
        service.getMapa = function() {
            if (self.mapa === undefined) {
                self.mapa = {
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
                        zoom : 14
                    }
                };
                service.updateLocation();
                service.plotMarkers();
            }

            return self.mapa;
        };

        /**
         * Chama a localizacao via GPS.
         *
         * @param callbackSucess funcao a ser chamada em caso de sucesso
         * @param callbackError funcao a ser chamada em caso de erro
         */
        function geolocation(callbackSucess, callbackError) {
            var options = {
                frequency : 1000,
                enableHighAccuracy: true,
                timeout: 15000, // tempo limite de espera do GPS, caso contrario, chama callbackError
                maximumAge: 0
            };
            $cordovaGeolocation.getCurrentPosition(options)
                .then(callbackSucess, callbackError);
        };

        /**
         * Feedback para quando o GPS nao funcionar.
         * Eh o callbackError do geolocation.
         */
        function feedbackGPSNotWorking() {
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
        function addMarker(marker) {
            // caso nao tenha _id, eh a posicao atual do usuario
            service.getMapa().markers[marker._id || 'user'] = {
                lat: marker.latitude,
                lng: marker.longitude,
                message: marker.userName || 'Voce esta aqui',
                focus: true,
                draggable: false
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
                    addMarker(info.data);
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
                UI.showLoading('Carregando vagas');
                for (var i = 0; i < info.data.length; i++) {
                    var swap = info.data[i];
                    addMarker(swap);
                }
                UI.hideLoading();
            }, function(error) {
                UI.hideLoading();
                UI.showPopup('Nao foi possivel carregar as vagas. Tente mais tarde   =(');
            });
        };

		return service;
	}]);
}());