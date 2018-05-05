angular.module('mainController', ['authServices', 'profileServices'])

.controller('mainCtrl', ['$location', '$timeout', 'Auth', 'Profile', '$rootScope', '$window', function($location, $timeout, Auth, Profile, $rootScope, $window) {
    var app = this;

    app.loadme = false;

    // Updates user parameters on reload
    $rootScope.$on('$routeChangeStart', function() {
        if(Auth.isLoggedIn()) {
            app.isLoggedIn = true;
            Auth.getUser().then(function(data) {
                // User Information
                app.username = data.data.username;
                app.givenname = data.data.givenname;
                app.email = data.data.email;
                app.loadme = true;
            });

            var promise = Auth.getUser().then(function(data) {
                return ({ user: data.data.username });
            });
            promise.then(function () {
                Profile.getProfileInfo({ user_info: promise.$$state.value }).then(function (dataPayload) {
                    console.log(dataPayload);
                    app.profile_payload = dataPayload;
                    app.usertypes = dataPayload.data.user.usertypes;
                });
            });

        } else {
            app.isLoggedIn = false;
            app.username = '';
            app.profile_payload = {};
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
                app.loading = false;
                app.errorMessage = data.data.message;
            }
        });
    };

    this.logout = function() {
        Auth.logout();
        $location.path('/');
    };
}]);
