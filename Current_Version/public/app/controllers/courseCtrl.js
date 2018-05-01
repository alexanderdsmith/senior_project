angular.module('courseController', ['courseServices'])

.controller('courseCtrl', ['Course', '$location', '$routeParams', function(Course, $location, $routeParams) {
    var app = this;
    app.url = JSON.parse('{"' + decodeURI(atob($routeParams.param)).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g,'":"') + '"}');
    if(app.url !== null && app.url !== undefined) {
        Course.getData({id: app.url.id}).then(function (data) {
            app.course_payload = data.data;
        });
    } else {
        app.course_payload = { errorMessage: "Course not found." };
    }

    // TODO: Instructors & TA's open documents
    this.openDocument = function(assn_id, user_id, assignment) {
        var assn = { id: assn_id, uid: user_id };
        Course.getStudentDocument(assn).then(function(document) {
            if(document) {
                var param = {
                    id: document.data.id,
                    type: app.url.usertype,
                    title: assignment.title,
                    description: assignment.description
                };
                var objectParam = Object.keys(param).map(function (k) {
                    if (param[k] !== null && param[k] !== undefined) {
                        return encodeURIComponent(k) + '=' + encodeURIComponent(param[k])
                    }
                }).join('&');
                $location.path('/document/' + btoa(objectParam));
            } else {
                app.errorMessage = "Document data could not be collected!";
            }
        });
    };

    this.addAnnouncement = function(text, user, c_id) {
        Course.addAnnouncement({text: text, postedBy: user, course: c_id}).then(function(data) {
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