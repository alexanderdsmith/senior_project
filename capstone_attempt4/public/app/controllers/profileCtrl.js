angular.module('profileController', ['profileServices'])

.controller('profileCtrl', function(Profile) {
    var app = this;

    this.uploadFile = function(csv) {
        var data = { csv: csv };
        Profile.passFile(data);
    };
});