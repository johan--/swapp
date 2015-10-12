(function() {
	'use strict';

	var app = angular.module('starter.controller');

    /**
     * Controller para a view de login
     */
	app.controller('LoginController',[
        '$scope',
        '$state',
        '$ionicModal',
        'UserService',
        'Auth',
        'UI', function ($scope, $state, $ionicModal, UserService, Auth, UI) {

        $scope.user = {};

        /**
         * Acao do botao para cadastrar um usuario
         */
        $scope.signup = function() {
            $state.go('signup');
        };

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
            UI.showLoading('Carregando');
            Auth.login($scope.user.email, $scope.user.password).then(function(info) {
                Auth.setToken(info);
                UI.hideLoading();
                $state.go('app.map');
            }, function(err) {
                UI.hideLoading();
                UI.showPopup(err.data.message);
            });

         };

        /**
        * Function to create a new user
        *
        * @param user {Object} with user data trying to sign up
        */
        $scope.createUser = function () {
            if (!isUserValid()) {
                UI.showPopup('Preencha corretamente o cadastro');
            } else {
                UserService.save($scope.user).then(function(data) {
                        UI.showPopup('Cadastro com sucesso!').then(function(res) {
                            $scope.modal.remove();
                        });
                }, function(err) {
                    UI.showPopup(err.data.message);
                });
            }
        };

        // determina se o cadastro do usuario eh valido
        function isUserValid() {
            return $scope.user.password === $scope.user.confirmation;
        };

        // Ao remover o modal de cadastro, ir para o login
        $scope.$on('modal.removed', function() {
            $state.go('login');
        });
	}]);
}());