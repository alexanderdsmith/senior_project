angular.module('profileController', ['profileServices'])

.controller('profileCtrl', function(Profile) {
    var app = this;

    this.uploadFile = function(authcsv) {
        console.log(app.authcsv);
        Profile.sendFile(app.authcsv);
    };
});