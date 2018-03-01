angular.module('profileServices', [])

.factory('Profile', function($http, Auth) {
    var profileFactory = {};

    // Profile.sendFile(csv); will send csv to express
    profileFactory.passFile = function(data) {
        return $http.post('/api/uploadAuthList', data).then(function(data) {
            return data;
        });
    };

    profileFactory.pullSections = function() {
        return $http.post('/api/sections', { user: Auth.getUser() }).then(function(data) {
            return data;
        })
    };

    return profileFactory;
});