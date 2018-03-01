angular.module('conceptmapsApp', ['appRoutes',
    //controllers
    'userControllers',
    'mainController',
    'profileController',
    //directives
    'fileDirectives',
    // services
    'profileServices',
    'userServices',
    'authServices',
    'ngAnimate'])

.config(function($httpProvider) {
    $httpProvider.interceptors.push('AuthInterceptors');
})

.directive('fileModel', []);