(function() {

	'use strict';

	var app = angular.module('starter.service');

	app.factory('MapService', function($cordovaGeolocation, $ionicLoading) {

		var user = {};

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
			map.center.lat  = position.coords.latitude;
			map.center.lng = position.coords.longitude;
			map.center.zoom = 15;
		};

		function setMarker(map, position) {
			map.markers.now = {
				lat:position.coords.latitude,
				lng:position.coords.longitude,
				message: "You Are Here",
				focus: true,
				draggable: false
			};
		};

		user.updateLocation = function(map) {
			showLoading();

			$cordovaGeolocation.getCurrentPosition().then(function(position) {
				setCenter(map, position);
				setMarker(map, position);
				hideLoading();
			}, function(error) {
				hideLoading();
				console.log(error);
			}, options);
		};
		
		return user;
	});

}());