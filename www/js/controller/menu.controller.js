(function() {

  'use strict';

  var app = angular.module('starter.controller');

  app.controller('MenuController', function($scope, $state, $ionicPopup, Auth) {
  	$scope.logout = function() {
		var confirmPopup = $ionicPopup.confirm({
        	title: 'Logout',
        	template: 'Você quer realmente sair?',
        	cancelText: 'Não',
        	okText: 'Sim'
      	});

      	confirmPopup.then(function(answer) {
        	if (answer) {
                Auth.logout().then(function(info) {
                    Auth.clear();
                    $state.go("login");
                }, function(error) {
                    Auth.clear();
                    console.log(error);
                });

        	}
      	});
  	};
  });

}());