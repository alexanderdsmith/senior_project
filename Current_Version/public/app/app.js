angular.module('conceptmapsApp', [
    //angular dependencies
    'appRoutes',
    'ngAnimate',

    //controllers
    'documentControllers',
    'userControllers',
    'mainController',
    'profileController',

    //directives
    'fileDirectives',

    // services
    'documentServices',
    'profileServices',
    'userServices',
    'authServices'])

.config(function($httpProvider) {
    $httpProvider.interceptors.push('AuthInterceptors');
});