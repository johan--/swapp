(function() {

	'use strict';

	var app = angular.module('starter.service');

	app.factory('UserService', function($cordovaGeolocation) {
		var user = {
			coords: {
				latitude: -7.9469328, 
				longitude: -73 
			}
		};

		user.updateLocation = function(map) {
			var options = {
				enableHighAccuracy: true,
				timeout: 3000,
				maximumAge: 0  
			};

			$cordovaGeolocation.getCurrentPosition().then(function(position) {
				user.coords.latitude = position.coords.latitude;
				user.coords.longitude = position.coords.longitude;



				 map.center.lat  = position.coords.latitude;
          map.center.lng = position.coords.longitude;
          map.center.zoom = 15;

          map.markers.now = {
            lat:position.coords.latitude,
            lng:position.coords.longitude,
            message: "You Are Here",
            focus: true,
            draggable: false
          };


			}, function(error) {
				console.log(error);
			}, options);
		};
		
		return user;
	});

}());