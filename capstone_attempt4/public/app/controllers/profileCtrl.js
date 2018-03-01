angular.module('profileController', ['authServices', 'profileServices'])

.controller('profileCtrl', function(Profile, Auth, $rootScope) {
    var app = this;

    this.getStudentCourses = function() {
        var promise = Auth.getUser().then(function(data) {
            return { user: data.data.username };
        });

        promise.then(function() {
            console.log();
            Profile.getStudentInfo({ user_info: promise.$$state.value }).then(function (dataMessage) {
                // User Information
                console.log(dataMessage);
            });
        });
    };

    this.uploadFile = function(csv) {
        var file = { csv: csv };
        Profile.passFile(file).then(function(data) {
            if(data.data.success === true) {
                app.successMessage = data.data.message;
            } else {
                app.errorMessage = data.data.message;
            }
        });
    };
});