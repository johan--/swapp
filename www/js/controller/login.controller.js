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
                console.log('info', info);
                Auth.setToken(info.data.token);
                Auth.setUserId(info.data.id);
                UI.hideLoading();
                $scope.user = {};
                $state.go('app.map');
            }, function(err) {
                UI.hideLoading();
                var mensagem = "Não foi possível logar";
                if (err.data !== undefined && err.data.message !== undefined) {
                    mensagem = err.data.message;
                }
                UI.showPopup(mensagem);
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
                            $scope.modal.hide();
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
	}]);
}());