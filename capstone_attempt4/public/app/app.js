angular.module('conceptmapsApp', ['appRoutes',
    'userControllers',
    'mainController',
    'profileController',
    'profileServices',
    'userServices',
    'authServices',
    'ngAnimate'])

.config(function($httpProvider) {
    $httpProvider.interceptors.push('AuthInterceptors');
})

.directive('fileModel', []);