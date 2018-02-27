angular.module('conceptmapsApp', ['appRoutes',
    'userControllers',
    'mainController',
    'profileController',
    'userServices',
    'authServices',
    'ngAnimate'])

.config(function($httpProvider) {
    $httpProvider.interceptors.push('AuthInterceptors');
});