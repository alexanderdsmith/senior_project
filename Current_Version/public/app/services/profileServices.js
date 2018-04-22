angular.module('profileServices', [])

.factory('Profile', ['$http', function($http) {
    var profileFactory = {};

    // Profile.sendFile(csv); will send csv to express
    profileFactory.passFile = function(data) {
        return $http.post('/api/uploadCourse', data).then(function(data) {
            return data;
        });
    };

    profileFactory.getCourse = function(course) {
        return $http.post('/api/getCourse', course).then(function(data) {
            return data;
        });
    };

    profileFactory.getDocument = function(assn) {
        return $http.post('/api/getCourse', assn).then(function(data) {
            return data;
        });
    };

    profileFactory.getProfileInfo = function(user_info) {
        return $http.get('/api/profileData', user_info).then(function(data) {
            return data;
        });
    };

    profileFactory.addAssignment = function(assignment) {
        return $http.post('/api/addAssignment', assignment).then(function(data) {
            return data;
        });
    };

    profileFactory.addCourse = function(name) {
        return $http.post('api/addCourse', name).then(function(data) {
            return data;
        });
    };

    profileFactory.addAnnouncement = function(text) {
        return $http.post('api/addAnnouncement', text).then(function(data) {
            return data;
        });
    };

    return profileFactory;
}]);