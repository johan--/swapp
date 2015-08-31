(function() {
    'use strict';

    var app = angular.module('starter.controller');

    app.controller('BugController', ['$scope', '$state', 'Bug', '$ionicPopup', function($scope, $state, Bug, $ionicPopup) {
        $scope.tipos = [
          'Critico',
            'Leve'
        ];

        $scope.bug = {};

        $scope.send = function() {
            Bug.save($scope.bug).then(function(info) {
                showPopup('Obrigado! Iremos melhorar  =)').then(function() {
                    $state.go('app.map');
                });
            }, function(err) {
                showPopup('Nao foi possivel enviar o bug. Tente novamente mais tarde').then(function() {
                });
            });
        };

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
    }]);
}());