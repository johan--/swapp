(function() {
	'use strict';

	var app = angular.module('starter.service');

	app.factory('MapService', function($cordovaGeolocation, $ionicLoading) {

		var map = {};

		var options = {
			enableHighAccuracy: true,
			timeout: 3000,
			maximumAge: 0  
		};

		function showLoading() {
			$ionicLoading.show({
				template: 'Loading...'
			});
		};

		function hideLoading() {
			$ionicLoading.hide();
		};

		function setCenter(map, position) {
			map.center = {
				lat: position.coords.latitude,
				lng: position.coords.longitude,
				zoom: 15
			}
		};

		function setMarker(map, position) {
			map.markers.now = {
				lat:position.coords.latitude,
				lng:position.coords.longitude,
				message: "Você está aqui =)",
				focus: true,
				draggable: false
			};
		};

		map.updateLocation = function(map) {
			showLoading();

			$cordovaGeolocation.getCurrentPosition().then(function(position) {
                console.log('dados posicao', position);
				setCenter(map, position);
				setMarker(map, position);
				hideLoading();
			}, function(error) {
				hideLoading();
				console.log(error);
			}, options);
		};

		map.givePlace = function(map) {
			showLoading();

			$cordovaGeolocation.getCurrentPosition().then(function(position) {
				console.log('realiza o post');
				setCenter(map, position);
				setMarker(map, position);
				hideLoading();
			}, function(error) {
				hideLoading();
				console.log(error);
			}, options);
		};

		return map;
	});
}());