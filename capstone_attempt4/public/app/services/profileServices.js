angular.module('profileServices', [])

.factory('Profile', function($http) {
    var profileFactory = {};

    // Profile.sendFile(csv); will send csv to express
    profileFactory.passFile = function(data) {
        return $http.post('/api/uploadAuthList', data).then(function(data) {
            return data;
        });
    };

    profileFactory.getStudentInfo = function(user_info) {
        console.log(user_info);
        return $http.post('/api/profileData', user_info).then(function(data) {
            return data;
        });
    };

    return profileFactory;
});