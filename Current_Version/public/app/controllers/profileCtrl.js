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
            type: type  // TODO: Design type to allow different users' access
        };
        Profile.getCourse(course).then(function(payload) {
            if (payload) {
                var objectParam = Object.keys(course).map(function(k) {
                    if(course[k] !== null && course[k] !== undefined) {
                        return encodeURIComponent(k) + '=' + encodeURIComponent(course[k])
                    }
                }).join('&');
                $location.path('/course/' + btoa(objectParam));
            } else {
                app.errorMessage = "Course data could not be collected!";
            }
        });
    };

    // TODO: ensure that only ADMINS can do this...
    this.addCourse = function(name) {
        Profile.addCourse(name).then(function(data) {
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