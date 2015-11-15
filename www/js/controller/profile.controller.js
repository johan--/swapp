(function() {
    var app = angular.module('starter.controller');

    /**
     * Controller para a view de profile
     */
    app.controller('ProfileController', [
        '$scope',
        'UserService',
        'Auth',
        'UI', function($scope, UserService, Auth, UI) {

        $scope.user = {};
        UI.showLoading('Carregando...');

        UserService.getById(Auth.getUserId()).then(function(info) {
            UI.hideLoading();
            $scope.user = info.data;
        }, function(erro) {
            UI.hideLoading();
            UI.showPopup("Erro ao carregar os dados. Tente novamente.");
        });

        $scope.salvar = function() {
            UI.showLoading('Salvando...');
            UserService.update(Auth.getUserId(), $scope.user).then(function(info) {
                UI.hideLoading();
                $scope.user = info.data;
                UI.showPopup("Salvo com sucesso!");
            }, function(erro) {
                UI.hideLoading();
                UI.showPopup("Erro ao enviar os dados. Tente novamente.");
            });
        };
    }]);
}());