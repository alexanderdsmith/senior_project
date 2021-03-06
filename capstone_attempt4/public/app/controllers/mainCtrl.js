angular.module('mainController', ['authServices'])

.controller('mainCtrl', function($location, $timeout, Auth, $rootScope, $window) {
    var app = this;

    app.loadme = false;

    // Updates user parameters on reload
    $rootScope.$on('$routeChangeStart', function() {
        if(Auth.isLoggedIn()) {
            app.isLoggedIn = true;
            Auth.getUser().then(function(data) {
                // User Information
                app.username = data.data.username;
                app.email = data.data.email;
                app.usertypes = data.data.usertypes;
                app.loadme = true;
            });
        } else {
            app.isLoggedIn = false;
            app.username = '';
            app.loadme = true;
        }
    });

    this.google = function() {
        $window.location = $window.location.protocol + '//' + $window.location.host + '/auth/google';
    };

    this.doLogin = function(loginData) {
        app.loading = true;
        app.errorMessage = false;

        Auth.login(app.loginData).then(function(data) {
            if(data.data.success === true) {
                // success message
                app.loading = false;
                app.successMessage = data.data.message + ' Redirecting...';
                $timeout(function() {
                    $location.path('/');
                    app.loginData = {};
                    app.successMessage = false;
                }, 2000);
            } else {
                // error message
                app.loading = false;
                app.errorMessage = data.data.message;
            }
        })
    };

    this.logout = function() {
        Auth.logout();
        $location.path('/');
    };
});

