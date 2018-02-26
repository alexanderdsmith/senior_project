angular.module('userControllers', ['userServices'])

.controller('localStrategyCtrl', function($location, $timeout, User) {

    var app = this;

    this.registerUser = function(regData) {
        app.loading = true;
        app.errorMessage = false;
        User.create(this.regData).then(function(data) {
            if(data.data.success === true) {
                // success message
                app.loading = false;
                app.successMessage = data.data.message + ' Redirecting...';
                $timeout(function() {
                    $location.path('/');
                }, 2000);
            } else {
                // error message
                app.loading = false;
                app.errorMessage = data.data.message;
            }
        });
    }
})

.controller('googleStrategyCtrl', function($routeParams, Auth, $location, $window) {

    var app = this;

    app.errorMessage = false;

    if($window.location.pathname === '/google-error') {
        app.errorMessage = 'Google account not registered';
    } else {
        Auth.google($routeParams.token);
        $location.path('/');
    }
});
