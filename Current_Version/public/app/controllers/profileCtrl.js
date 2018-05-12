angular.module('profileController', ['authServices', 'profileServices'])

.controller('profileCtrl', ['Profile', '$window', '$location', function(Profile, $window, $location) {
    var app = this;

    function reloadRoute() {
        if (app.errorMessage) {
            alert(app.errorMessage);
        }
        if (app.successMessage) {
            alert(app.successMessage);
        }
        $window.location.reload();
    }

    this.uploadFile = function(title, csv) {
        var file = {
            title: title,
            csv: csv
        };
        Profile.passFile(file).then(function(data) {
            if(data.data.success === true) {
                app.successMessage = data.data.message + '\nLog out to access personal courses';
            } else {
                app.errorMessage = data.data.message;
            }
        });
    };

    this.fetchCourse = function(id, type, user_id) {
        var course = {
            id: id,
            usertype: type,  // TODO: Design type to allow different users' access
            user_id: user_id
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

    this.deleteCourse = function(id) {
        Profile.deleteCourse({id: id}).then(function(data) {
            if (data.data.success === true) {
                app.successMessage = data.data.message;
                reloadRoute();
            }
            else {
                app.errorMessage = data.data.message;
            }
        });
    };

    this.deleteUser = function(cid, id, type) {
        Profile.deleteUser({cid: cid, id: id, type: type}).then(function(data) {
            if(data.data.success === true) {
                app.successMessage = data.data.message;
                reloadRoute();
            } else {
                app.errorMessage = data.data.message;
            }
        });
    };

    this.addUser = function(cid, username, type) {
        Profile.addUser({cid: cid, username: username, type: type}).then(function(data) {
            if(data.data.success === true) {
                app.successMessage = data.data.message;
                reloadRoute();
            } else {
                app.errorMessage = data.data.message;
            }
        })
    }

}]);