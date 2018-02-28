angular.module('conceptmapsApp', ['appRoutes',
    'userControllers',
    'mainController',
    'profileController',
    'fileDirectives',
    'profileServices',
    'userServices',
    'authServices',
    'ngAnimate'])

.config(function($httpProvider) {
    $httpProvider.interceptors.push('AuthInterceptors');
})

.directive('fileModel', []);