angular.module('profileServices', [])

.factory('Profile', function($http) {
    var profileFactory = {};

    // Profile.sendFile(csv); will send csv to express
    profileFactory.passFile = function(data) {
        return $http.post('/api/uploadAuthList', data).then(function(data) {

        });
    };

    return profileFactory;
});