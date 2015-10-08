(function() {
    'use strict';

    var app = angular.module('starter.controller');

    app.factory('Bug', function($http, ApiEndpoint) {
        var bug = {};

        var url = "/api/bug";

        bug.save = function(data) {
            return $http.post(ApiEndpoint.url +  url, data);
        };

        return bug;
    });
}());