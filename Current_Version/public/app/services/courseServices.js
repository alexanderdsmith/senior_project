angular.module('courseServices', [])

.factory('Course', ['$http', function($http) {
    var courseFactory = {};

    courseFactory.addAnnouncement = function(text) {
        return $http.post('api/addAnnouncement', text).then(function(data) {
            return data;
        });
    };

    courseFactory.addAssignment = function(assignment) {
        return $http.post('/api/addAssignment', assignment).then(function(data) {
            return data;
        });
    };

    courseFactory.getDocument = function(assn) {
        return $http.post('/api/getCourse', assn).then(function(data) {
            return data;
        });
    };

    return courseFactory;
}]);