angular.module('courseController', ['courseServices'])

.controller('courseCtrl', ['Course', '$routeParams', function(Course, $routeParams) {
    var app = this;
    app.course_payload = JSON.parse('{"' + decodeURI($routeParams.param).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g,'":"') + '"}');

    this.openDocument = function(assn_id) {
        var assn = { id: assn_id };
        Course.getDocument(assn).then(function(payload) {
            if (payload) {
                app.document_payload = payload;
            } else {
                app.errorMessage = "Document could not be loaded"
            }
            $location.path('/document');
        });
    };

    this.addAnnouncement = function(text) {
        Course.addAnnouncement(text).then(function(data) {
            if (data.data.success === true) {
                app.successMessage = data.data.message;
            }
            else {
                app.errorMessage = data.data.message;
            }
        })
    };

    this.addAssignment = function(title, description, due_date, time, c_id) {
        var assignment = {
            title: title,
            description: description,
            dueDate: due_date,
            time: time,
            course: c_id
        };

        Course.addAssignment(assignment).then(function(data) {
            if (data.data.success === true) {
                app.successMessage = data.data.message;
            }
            else {
                app.errorMessage = data.data.message;
            }
        });
    };
}]);