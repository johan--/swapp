(function() {
  'use strict';

  var app = angular.module('starter.controller');

  app.controller('MapController', function($scope, $state, $ionicPopup, MapService, Auth) {

    var MAP_STATE = 'app.map';

    $scope.$on("$stateChangeSuccess", function() {
        if ($state.current.name === MAP_STATE) {
            $scope.map = {
                defaults: {
                    tileLayer: 'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
                    maxZoom: 18,
                    zoomControlPosition: 'bottomleft'
                },
                markers : {},
                events: {
                    map: {
                        enable: ['context'],
                        logic: 'emit'
                    }
                }
            };
            $scope.centralizar();
            MapService.updateLocation($scope.map);
        }
    });

    /**
     * Acao disparada quando o usuario quer
     * oferecer a vaga
     */
    $scope.givePlace = function() {
      var confirmPopup = $ionicPopup.confirm({
        title: 'Disponibilizar vaga',
        template: 'Você vai realmente disponibilizar sua vaga?',
        cancelText: 'Não',
        okText: 'Sim'
      });

      confirmPopup.then(function(answer) {
        if (answer) {
          MapService.givePlace($scope.map);
        }
      });
    };

    /**
     * Acao temporaria apenas para centralizar o mapa.
     * Sem isto, o leaflet fica com problemas.
     */
    $scope.centralizar = function() {
      $scope.map.center  = {
        lat : 0,
        lng : 0,
        zoom : 12
      };
    };
  });
}());