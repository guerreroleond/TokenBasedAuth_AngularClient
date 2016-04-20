'use strict';

app.factory('authService', ['$http', '$q', 'localStorageService',
    function ($http, $q, localStorageService) {

        // test client from tutorial
        //var serviceBase = 'http://localhost:54989/';

        // MH client
        var serviceBase = 'http://localhost:53056/';
        var authServiceFactory = {};

        var _authentication = {
            isAuth: false,
            email: "",
            token: ""
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
            $http.post(serviceBase + 'token', data,
                { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } })
                .success(function (response) {
                    // save the token on localStorage
                    localStorageService.set('authorizationData',
                        { token: response.access_token, userName: loginData.email });
                    alert('logining... + token' + response.access_token);
                    _authentication.isAuth = true;
                    _authentication.email = loginData.email;
                    //_authentication.token = response.access_token

                    deferred.resolve(response);
                })
                .error(function (err, status) {
                    alert('error '+ err);
                    _logOut();
                    deferred.reject(err);
                });

            return deferred.promise;
        };

        var _logOut = function () {

            localStorageService.remove('authorizationData');

            _authentication.isAuth = false;
            _authentication.email = "";
            _authentication.token = "";
        };

        var _fillAuthData = function () {

            var authData = localStorageService.get('authorizationData');
            // alert('authData: ' + authData);

            if (authData) {
                _authentication.isAuth = true;
                _authentication.email = authData.userName;
                _authentication.token = authData.token;
                alert('filling auth data.. + auth.email: ' + _authentication.email + ' + token: ' + _authentication.token );
            }
        };

        authServiceFactory.saveRegistration = _saveRegistration;
        authServiceFactory.login = _login;
        authServiceFactory.logOut = _logOut;
        authServiceFactory.fillAuthData = _fillAuthData;
        authServiceFactory.authentication = _authentication;

        return authServiceFactory;
    }]);