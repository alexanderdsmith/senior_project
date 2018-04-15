angular.module('profileController', ['authServices', 'profileServices'])

.controller('profileCtrl', function(Profile, $window, $location) {
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
                app.course_payload = payload;
            } else {
                app.errorMessage = "Course data could not be collected!";
            }
        });
    };

    this.addAssignment = function(name, description) {
        var assignment = {
            title: name,
            description: description
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


});