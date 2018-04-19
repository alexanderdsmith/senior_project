angular.module('userServices', [])

.factory('User', ['$http', function($http) {
    var userFactory = {};

    // User.create(regData)
    userFactory.create = function(regData) {
        return $http.post('/api/users', regData);
    };

    return userFactory;
}]);