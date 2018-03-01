angular.module('conceptmapsApp', [
    //angular dependencies
    'appRoutes',
    'ngAnimate',

    //controllers
    'userControllers',
    'mainController',
    'profileController',

    //directives
    'fileDirectives',

    // services
    'profileServices',
    'userServices',
    'authServices'])

.config(function($httpProvider) {
    $httpProvider.interceptors.push('AuthInterceptors');
});