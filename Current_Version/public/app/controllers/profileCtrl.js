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
                var objectParam = Object.keys(payload.data).map(function(k) {
                    if(payload.data[k] !== null && payload.data[k] !== undefined) {
                        return encodeURIComponent(k) + '=' + encodeURIComponent(payload.data[k])
                    }
                }).join('&');
                $location.path('/course/' + objectParam);
            } else {
                app.errorMessage = "Course data could not be collected!";
            }
        });
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