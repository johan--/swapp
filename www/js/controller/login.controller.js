(function() {
	'use strict';

	var app = angular.module('starter.controller');

	app.controller('LoginController', function ($scope, $state, $ionicModal, $ionicPopup, UserService, $ionicLoading, Auth) {

        $scope.user = {};

	/**
	 * Make a modal for a new user
	 */
	 $ionicModal.fromTemplateUrl("templates/signup.html", {
	 	scope: $scope
	 }).then(function (modal) {
	 	$scope.modal = modal;
	 });

	/**
	 * Function to login at the application
	 *
	 * @param user {Object} with user data trying to sign up
	 */
	 $scope.login = function () {
        showLoading($ionicLoading);
	 	Auth.login($scope.user.email, $scope.user.password).then(function(info) {
            console.log(info);
            Auth.setToken(info);
            hideLoading($ionicLoading);
            $state.go('app.map');
        }, function(err) {
            console.log('err', err);
            hideLoading($ionicLoading);
            showPopup(err.data.message);
        });

	};

	$scope.signup = function() {
		$state.go('signup');
	};

	/**
	 * Function to create a new user
	 *
	 * @param user {Object} with user data trying to sign up
	 */
	 $scope.createUser = function () {
         if (!isUserValid()) {
             showPopup('Preencha corretamente o cadastro');
         } else {
             UserService.save($scope.user).then(function(data) {
                 showPopup('Cadastro com sucesso!').then(function(res) {
                     $scope.modal.remove();
                 });
             }, function(err) {
                 showPopup(err.data.message);
             });
         }
	};

    function isUserValid() {
        return $scope.user.password === $scope.user.confirmation;
    };

    // Execute action on remove modal
    $scope.$on('modal.removed', function() {
        $state.go('login');
    });

	/**
	 * Show a popup for the user with a message
	 *
	 * @param message the message for the user
	 *
	 * @return {Object} ionic popup
	 */
	 function showPopup(message) {
	 	var popup = $ionicPopup.alert({
	 		title: message
	 	});
	 	return popup;
	 };
	});
}());