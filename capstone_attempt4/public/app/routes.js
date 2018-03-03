var app = angular.module('appRoutes', ['ngRoute']).config(function($routeProvider, $locationProvider) {
    $routeProvider.when('/', {
        templateUrl: 'app/views/pages/home.html'
    }).when('/register', {
        templateUrl: 'app/views/pages/users/register.html',
        controller: 'localStrategyCtrl',
        controllerAs: 'register',
        authenticated: false
    }).when('/login', {
        templateUrl: 'app/views/pages/users/login.html',
        authenticated: false
    }).when('/logout', {
        templateUrl: 'app/views/pages/users/logout.html',
        authenticated: true
    }).when('/profile', {
        templateUrl: 'app/views/pages/users/profile.html',
        authenticated: true
    }).when('/admin', {
        templateUrl: 'app/views/pages/users/profiles/admin.html',
        controller: 'profileCtrl',
        controllerAs: 'profile',
        authenticated: true
    }).when('/student', {
        templateUrl: 'app/views/pages/users/profiles/student.html',
        controller: 'profileCtrl',
        controllerAs: 'profile',
        authenticated: true
    }).when('/ta', {
        templateUrl: 'app/views/pages/users/profiles/ta.html',
        controller: 'profileCtrl',
        controllerAs: 'profile',
        authenticated: true
    }).when('/teacher', {
        templateUrl: 'app/views/pages/users/profiles/teacher.html',
        controller: 'profileCtrl',
        controllerAs: 'profile',
        authenticated: true
    }).when('/studentSection', {
        templateUrl: 'app/views/pages/users/profiles/studentSection.html',
        controller: 'profileCtrl',
        controllerAs: 'profile',
        authenticated: true
    }).when('/teacherSection', {
        templateUrl: 'app/views/pages/users/profiles/teacherSection.html',
        controller: 'profileCtrl',
        controllerAs: 'profile',
        authenticated: true
    }).when('/documents', {
        templateUrl: 'app/views/pages/users/profiles/document.html',
        controller: 'documentCtrl',
        controllerAs: 'profile',
        authenticated: true
    }).when('/google/:token', {
        templateUrl: 'app/views/pages/users/social/social.html',
        controller: 'googleStrategyCtrl',
        controllerAs: 'google',
        authenticated: false
    }).when('/google-error', {
        templateUrl: 'app/views/pages/users/login.html',
        controller: 'googleStrategyCtrl',
        controllerAs: 'google',
        authenticated: false
    }).otherwise({ redirectTo: '/' });

    $locationProvider.html5Mode({
        enabled: true,
        requiredBase: false
    })
});

app.run(['$rootScope', 'Auth', '$location', function($rootScope, Auth, $location) {

    $rootScope.$on('$routeChangeStart', function(event, next, current) {
        if(next.$$route.authenticated === true) {
            if(!Auth.isLoggedIn()) {
                event.preventDefault();
                $location.path('/');
            }
        } else if(next.$$route.authenticated === false) {
            if(Auth.isLoggedIn()) {
                event.preventDefault();
                $location.path('/profile');
            }
        }
    });
}]);
