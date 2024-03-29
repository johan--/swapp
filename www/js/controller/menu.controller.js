(function() {

    'use strict';

    var app = angular.module('starter.controller');

    /**
     * Controller para o menu.
     */
    app.controller('MenuController',[
        '$scope',
        '$state',
        '$ionicPopup',
        'Auth',
        'MapService',
        'UI', function($scope, $state, $ionicPopup, Auth, MapService, UI) {

        $scope.logout = function() {
        var confirmPopup = $ionicPopup.confirm({
            title: 'Logout',
            template: 'Você quer realmente sair?',
            cancelText: 'Não',
            okText: 'Sim',
            okType: 'button-assertive'
        });

        confirmPopup.then(function(answer) {
            if (answer) {
                UI.showLoading('Fazendo logout...');
                Auth.logout().then(function(info) {
                    UI.hideLoading();
                    Auth.clear();
                    MapService.resetaMapa();
                    $state.go("login");
                }, function(error) {
                    UI.hideLoading();
                    UI.showPopup('Logout sem sucesso');
                });
            }
        });
    };
    }]);
}());