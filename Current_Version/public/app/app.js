angular.module('conceptmapsApp', [
    //angular dependencies
    'appRoutes',
    'ngAnimate',

    //controllers
    'courseController',
    'documentControllers',
    'userControllers',
    'mainController',
    'profileController',

    //directives
    'fileDirectives',

    // services
    'courseServices',
    'documentServices',
    'profileServices',
    'userServices',
    'authServices'])

.config(function($httpProvider) {
    $httpProvider.interceptors.push('AuthInterceptors');
});