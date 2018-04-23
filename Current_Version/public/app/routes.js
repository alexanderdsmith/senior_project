var prefix = '/';

var app = angular.module('appRoutes', ['ngRoute']).config(function($routeProvider, $locationProvider) {
    $routeProvider.when(prefix, {
        templateUrl: prefix + 'app/views/pages/home.html'
    }).when(prefix + 'register', {
        templateUrl: prefix + 'app/views/pages/users/register.html',
        controller: 'localStrategyCtrl',
        controllerAs: 'register',
        authenticated: false
    }).when(prefix + 'login', {
        templateUrl: prefix + 'app/views/pages/users/login.html',
        authenticated: false
    }).when(prefix + 'logout', {
        templateUrl: prefix + 'app/views/pages/users/logout.html',
        authenticated: true
    }).when(prefix + 'profile', {
        templateUrl: prefix + 'app/views/pages/users/profile.html',
        authenticated: true
    }).when(prefix + 'admin', {
        templateUrl: prefix + 'app/views/pages/users/profiles/admin.html',
        controller: 'profileCtrl',
        controllerAs: 'profile',
        authenticated: true
    }).when(prefix + 'student', {
        templateUrl: prefix + 'app/views/pages/users/profiles/student.html',
        controller: 'profileCtrl',
        controllerAs: 'profile',
        authenticated: true
    }).when(prefix + 'ta', {
        templateUrl: prefix + 'app/views/pages/users/profiles/ta.html',
        controller: 'profileCtrl',
        controllerAs: 'profile',
        authenticated: true
    }).when(prefix + 'teacher', {
        templateUrl: prefix + 'app/views/pages/users/profiles/teacher.html',
        controller: 'profileCtrl',
        controllerAs: 'profile',
        authenticated: true
    }).when(prefix + 'course/:param', {
        templateUrl: prefix + 'app/views/pages/users/profiles/course.html',
        controller: 'courseCtrl',
        controllerAs: 'course',
        reloadOnSearch: false,
        authenticated: true
    }).when(prefix + 'document', {
        templateUrl: prefix + 'app/views/pages/users/profiles/document.html',
        controller: 'documentCtrl',
        controllerAs: 'document',
        reloadOnSearch: false,
        authenticated: true
    }).when(prefix + 'google/:token', {
        templateUrl: prefix + 'app/views/pages/users/social/social.html',
        controller: 'googleStrategyCtrl',
        controllerAs: 'google',
        authenticated: false
    }).when(prefix + 'google-error', {
        templateUrl: prefix + 'app/views/pages/users/login.html',
        controller: 'googleStrategyCtrl',
        controllerAs: 'google',
        authenticated: false
    }).otherwise({ redirectTo: prefix });

    $locationProvider.html5Mode({
        enabled: true,
        requiredBase: false
    })
});

app.run(['$rootScope', 'Auth', 'Profile', '$location', function($rootScope, Auth, Profile, $location) {

    $rootScope.$on('$routeChangeStart', function(event, next, current) {
        if(next.$$route.authenticated === true) {
            if (!Auth.isLoggedIn()) {
                event.preventDefault();
                $location.path(prefix);
            }
        } else if(next.$$route.authenticated === false) {
            if (Auth.isLoggedIn()) {
                event.preventDefault();
                $location.path(prefix + 'profile');
            }
        }
    });
}]);
