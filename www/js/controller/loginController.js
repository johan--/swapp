(function() {
	'use strict';

	var app = angular.module('starter.controller');

	app.controller('LoginController', function ($scope, $state, $ionicModal, $ionicPopup, $ionicLoading) {

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
	 	console.log("fazer login");
	 	$state.go('app.map');
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
	 	console.log('criar usuario');
	 	$scope.modal.remove();
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