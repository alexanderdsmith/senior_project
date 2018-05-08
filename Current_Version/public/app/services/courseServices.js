angular.module('courseServices', [])

.factory('Course', ['$http', function($http) {
    var courseFactory = {};

    courseFactory.addAnnouncement = function(announcement) {
        return $http.post('api/addAnnouncement', announcement).then(function(data) {
            return data;
        });
    };

    courseFactory.editAnnouncement = function(announcement) {
        return $http.post('api/editAnnouncement', announcement).then(function(data) {
            return data;
        });
    };

    courseFactory.deleteAnnouncement = function(announcement) {
        return $http.post('api/deleteAnnouncement', announcement).then(function(data) {
            return data;
        });
    };

    courseFactory.addAssignment = function(assignment) {
        return $http.post('/api/addAssignment', assignment).then(function(data) {
            return data;
        });
    };

    courseFactory.editAssignment = function(assignment) {
        return $http.post('/api/editAssignment', assignment).then(function(data) {
            return data;
        });
    };

    courseFactory.deleteAssignment = function(assignment) {
        return $http.post('/api/deleteAssignment', assignment).then(function(data) {
            return data;
        });
    };

    courseFactory.getData = function(id) {
        return $http.post('/api/getCourse', id).then(function(data) {
            return data;
        });
    };

    courseFactory.getStudentDocument = function(assn) {
        return $http.post('/api/getStudentDocument', assn).then(function(data) {
            return data;
        });
    };

    courseFactory.forceSubmit = function(assn) {
        return $http.post('/api/forceSubmit', assn).then(function(data) {
            return data;
        });
    };

    return courseFactory;
}]);