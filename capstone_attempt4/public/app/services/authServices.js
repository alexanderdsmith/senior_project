angular.module('authServices', [])

.factory('Auth', function($http, AuthToken) {
    authFactory = {};

    // Auth.login(loginData)
    authFactory.login = function(loginData) {
        return $http.post('/api/authenticate', loginData).then(function(data) {
            AuthToken.setToken(data.data.token);
            return data;
        });
    };

    // Auth.isLoggedIn()
    authFactory.isLoggedIn = function() {
        if(AuthToken.getToken()) {
            return true;
        } else {
            return false;
        }
    };

    // Auth.logout()
    authFactory.logout = function() {
        AuthToken.setToken();
    };

    authFactory.getUser = function() {
        if(AuthToken.getToken()) {
            return $http.post('/api/currUser', null);
        } else {
            $q.reject({ message: 'User has no token!' });
        }
    };

    authFactory.google = function(token) {
        AuthToken.setToken(token);
    };

    return authFactory;
})

.factory('AuthToken', function($window) {
    var authTokenFactory = {};

    // Auth.setToken(token)
    authTokenFactory.setToken = function(token) {
        if (token) {
            $window.localStorage.setItem('token', token);
        } else {
            $window.localStorage.removeItem('token');
        }
    };

    // Auth.getToken()
    authTokenFactory.getToken = function() {
        return $window.localStorage.getItem('token');
    };

    return authTokenFactory;
})

.factory('AuthInterceptors', function(AuthToken) {
    var authInterceptorFactory = {};

    authInterceptorFactory.request = function(config) {
        var token = AuthToken.getToken();
        if(token) {
            config.headers['x-access-token'] = token;
        }

        return config;
    };

    return authInterceptorFactory;
});