(function() {
    'use strict';

    var app = angular.module('starter.factory');

    /**
     * Factory para o cadastro de bugs.
     */
    app.factory('Bug', [
        '$http',
        'ApiEndpoint', function($http, ApiEndpoint) {
        var bug = {};

        var url = "/api/bug";

        bug.save = function(data) {
            return $http.post(ApiEndpoint.url +  url, data);
        };

        return bug;
    }]);
}());