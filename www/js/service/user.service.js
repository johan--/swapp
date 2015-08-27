(function() {
    'use strict';

    var app = angular.module('starter.service');

    app.factory('UserService', function($http, ApiEndpoint) {
        var user = {};

        var url = "/api/user";

        user.save = function(data) {
            return $http.post(ApiEndpoint.url +  url, data);
        };

        user.update = function(data) {
            return $http.put(ApiEndpoint.url + url, data);
        };

        user.login = function(email, password) {
            var data = {
                email: email,
                password: password
            };
            return $http.post(ApiEndpoint.url + '/api/login', data);
        };

        return user;
    });
}());