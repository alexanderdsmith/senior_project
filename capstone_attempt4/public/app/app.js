angular.module('conceptmapsApp', ['appRoutes', 'userControllers', 'mainController', 'userServices', 'authServices', 'ngAnimate'])

.config(function($httpProvider) {
    $httpProvider.interceptors.push('AuthInterceptors');
});