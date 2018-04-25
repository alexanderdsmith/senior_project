angular.module('courseController', ['courseServices'])

.controller('courseCtrl', ['Course', '$location', '$routeParams', function(Course, $location, $routeParams) {
    var app = this;
    app.url = JSON.parse('{"' + decodeURI(atob($routeParams.param)).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g,'":"') + '"}');
    console.log(app.url);
    if(app.url !== null && app.url !== undefined) {
        Course.getData({ id: app.url.id }).then(function(data) {
            console.log(data);
            app.course_payload = data.data;
        });
    } else {
        app.course_payload = { errorMessage: "404: Course not found." };
    }
    this.openDocument = function(assn_id) {
        var assn = { id: assn_id };
        Course.getDocument(assn).then(function(payload) {
            if (payload) {
                app.document_payload = payload;
            } else {
                app.errorMessage = "Document could not be loaded";
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
        });
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