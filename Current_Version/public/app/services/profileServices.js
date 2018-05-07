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

    profileFactory.getProfileInfo = function(user_info) {
        return $http.get('/api/profileData', user_info).then(function(data) {
            return data;
        });
    };

    profileFactory.deleteCourse = function(id) {
        return $http.post('/api/deleteCourse', id).then(function(data) {
            return data;
        });
    };

    return profileFactory;
}]);