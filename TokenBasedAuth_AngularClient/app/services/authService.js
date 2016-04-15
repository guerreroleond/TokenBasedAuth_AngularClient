'use strict';

app.factory('authService', ['$http', '$q', 'localStorageService',
    function ($http, $q, localStorageService) {

        var serviceBase = 'http://localhost:54989/';
        var authServiceFactory = {};

        var _authentication = {
            isAuth: false,
            email: ""
        };

        var _saveRegistration = function (registration) {

            _logOut();

            return $http.post(serviceBase + "api/account/register", registration)
                .then(function (response) {
                    return response;
                });
        };

        var _login = function (loginData) {

            var data = "grant_type=password&username="
                        + loginData.email + "&password=" + loginData.password;

            var deferred = $q.defer();
            // here we request for the token
            $http.post(serviceBase + 'token', data
                , { headers: { 'Content-Type': 'application/x-www-from-urlencoded' } })
                .success(function (response) {
                    // save the token on localStorage
                    localStorageService.set('authorizationData',
                        { token: response.access_token, userName: loginData.email });

                    _authentication.isAuth = true;
                    _authentication.email = loginData.email;

                    deferred.resolve(response);
                })
                .error(function (err, status) {
                    _logOut();
                    deferred.reject(err);
                });

            return deferred.promise;
        };

        var _logOut = function () {

            localStorageService.remove('authorizationData');

            _authentication.isAuth = false;
            _authentication.email = "";
        };

        var _fillAuthData = function () {

            var authData = localStorageService.get('authorizationData');
            if (authData) {
                _authentication.isAuth = true;
                _authentication.email = authData.email;
            }
        };

        authServiceFactory.saveRegistration = _saveRegistration;
        authServiceFactory.login = _login;
        authServiceFactory.logOUt = _logOut;
        authServiceFactory.fillAuthData = _fillAuthData;
        authServiceFactory.authentication = _authentication;

        return authServiceFactory;
    }]);