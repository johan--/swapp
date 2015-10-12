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

		var options = {
			enableHighAccuracy: true,
			timeout: 3000,
			maximumAge: 0 
		};

        self.mapa = undefined;

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
                        zoom : 12
                    }
                };
                service.updateLocation();
                service.plotMarkers();
            }

            return self.mapa;
        };

		function setCenter(position) {
			service.getMapa().center = {
				lat: position.coords.latitude,
				lng: position.coords.longitude,
				zoom: 15
			}
		};

        function addMarker(position) {
            service.getMapa().markers.now = {
                lat:position.latitude,
                lng:position.longitude,
                message: position.userName || 'Voce esta aqui',
                focus: true,
                draggable: false
            };
        };

		service.updateLocation = function() {
			UI.showLoading('Carregando');
			$cordovaGeolocation.getCurrentPosition().then(function(position) {
				setCenter(position);
                var position = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                };
				addMarker(position);
				UI.hideLoading();
			}, function(error) {
				UI.hideLoading();
			}, options);
		};

		service.givePlace = function() {
			UI.showLoading('Carregando...');

			$cordovaGeolocation.getCurrentPosition().then(function(position) {
                var swap = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    time: new Date()
                };
                UserService.sendPlace(swap).then(function(info) {
                    setCenter(position);
                    addMarker(info.data);
                }, function(error) {
                    UI.showPopup('A vaga nao rolou =(');
                });
				UI.hideLoading();
			}, function(error) {
				UI.hideLoading();
			}, options);
		};

        service.plotMarkers = function() {
            if (!_.isUndefined(mapa.markers.now)
                && !_.isNull(mapa.markers.now)) {
                console.log(mapa.markers);
                console.log('clear');
            }
            UserService.getSwaps().then(function(info) {
                for (var i = 0; i < info.data.length; i++) {
                    addMarker(info.data[i]);
                }
            }, function(error) {
                UI.showPopup('Nao foi possivel carregar as vagas. Tente mais tarde   =(');
            });
        };

		return service;
	}]);
}());
