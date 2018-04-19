angular.module('profileController', ['authServices', 'profileServices'])

.controller('profileCtrl', ['Profile', '$window', '$location', function(Profile, $window, $location) {
    var app = this;

    this.uploadFile = function(title, csv) {
        var file = {
            title: title,
            csv: csv
        };
        Profile.passFile(file).then(function(data) {
            if(data.data.success === true) {
                app.successMessage = data.data.message;
            } else {
                app.errorMessage = data.data.message;
            }
        });
    };

    this.fetchCourse = function(id, type) {
        var course = {
            id: id,
            type: type
        };
        Profile.getCourse(course).then(function(payload) {
            if (payload) {
                app.course_payload = payload.data;
                console.log(app.course_payload); // TODO: why is this empty??
            } else {
                app.errorMessage = "Course data could not be collected!";
            }
            $location.path('/course');
        });
    };

    this.openDocument = function(assn_id) {
        var assn = { id: assn_id };
        Profile.getDocument(assn).then(function(payload) {
            if (payload) {
                app.document_payload = payload;
            } else {
                app.errorMessage = "Document could not be loaded"
            }
            $location.path('/document');
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

        Profile.addAssignment(assignment).then(function(data) {
            if (data.data.success === true) {
                app.successMessage = data.data.message;
            }
            else {
                app.errorMessage = data.data.message;
            }
        });
    };

    this.addAnnouncement = function(text) {
        var announcementText = text;

        Profile.addAnnouncement(announcementText).then(function(data) {
            if (data.data.success === true) {
                app.successMessage = data.data.message;
            }
            else {
                app.errorMessage = data.data.message;
            }
        })
    };

    this.addCourse = function(name) {
        var courseName = name;

        Profile.addCourse(courseName).then(function(data) {
           if (data.data.success === true) {
               app.successMessage = data.data.message;
           }
           else {
               app.errorMessage = data.data.message;
           }
        });
    };

    // add in future update
    this.removeAssignment = function(assignment) {
    };

    this.removeAnnouncement = function(announcement) {
    };


}]);