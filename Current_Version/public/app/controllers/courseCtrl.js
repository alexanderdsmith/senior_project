angular.module('courseController', ['courseServices'])

.controller('courseCtrl', ['Course', '$location', '$window', '$routeParams', function(Course, $location, $window, $routeParams) {
    var app = this;
    app.url = JSON.parse('{"' + decodeURI(atob($routeParams.param)).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g,'":"') + '"}');
    if(app.url !== null && app.url !== undefined) {
        Course.getData({id: app.url.id}).then(function (data) {
            app.course_payload = data.data;
            var assign = app.course_payload.assignments;

            for(var i = 0; i < assign.length; i++){
                var currDate = new Date(Date.now());
                var dueTime = Date.parse(assign[i].dueDate);
                app.course_payload.assignments[i].pastDue = Date.parse(currDate) > dueTime;
                if(app.course_payload.assignments[i].pastDue) {
                    Course.forceSubmit(app.course_payload.assignments[i]).then(function(data) {
                        console.log(data.data);
                    });
                }
            }

            app.course_payload.assignments.forEach(function(assignment) {
                var allg = 0;
                assignment.documents.forEach(function(document) {
                    if(document.grade === -1) {
                        allg++;
                    }
                });

                assignment.allgraded = allg;
            });
        })
    } else {
        app.course_payload = { errorMessage: "Course not found." };
    }

    function reloadRoute() {
        if (app.errorMessage) {
            alert(app.errorMessage);
        }
        if (app.successMessage) {
            alert(app.successMessage);
        }
        $window.location.reload();
    }

    // TODO: Instructors & TA's open documents
    this.openDocument = function(assn_id, user_id, assignment) {
        var assn = { id: assn_id, uid: user_id };
        Course.getStudentDocument(assn).then(function(document) {
            if(document) {
                var param = {
                    id: document.data.id,
                    usertype: app.url.usertype,
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
                reloadRoute();
            }
            else {
                app.errorMessage = data.data.message;
            }
        });
    };

    this.editAnnouncement = function(id, description) {
        Course.editAnnouncement({id: id, description: description}).then(function(data) {
            if (data.data.success === true) {
                app.successMessage = data.data.message;
                reloadRoute();
            }
            else {
                app.errorMessage = data.data.message;
            }
        });
    };

    this.deleteAnnouncement = function(id) {
        Course.deleteAnnouncement({id: id}).then(function(data) {
            if (data.data.success === true) {
                app.successMessage = data.data.message;
                reloadRoute();
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
                reloadRoute();
            }
            else {
                app.errorMessage = data.data.message;
            }
        });
    };

    this.editAssignment = function(id, title, description, due_date, time) {
        var assignment = {
            id: id,
            title: title,
            description: description,
            dueDate: due_date,
            time: time
        };

        Course.editAssignment(assignment).then(function(data) {
            if (data.data.success === true) {
                app.successMessage = data.data.message;
                reloadRoute();
            }
            else {
                app.errorMessage = data.data.message;
            }
        });
    };

    this.deleteAssignment = function(id) {
        var assignment = {
            id: id
        };

        Course.deleteAssignment(assignment).then(function(data) {
            if (data.data.success === true) {
                app.successMessage = data.data.message;
                reloadRoute();
            }
            else {
                app.errorMessage = data.data.message;
            }
        });
    };
}]);