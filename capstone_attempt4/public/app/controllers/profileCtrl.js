angular.module('profileController', ['profileServices'])

.controller('profileCtrl', function(Profile) {
    var app = this;

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

    this.getSections = function() {
        Profile.pullSections().then(function(data) {
            app.sections = data.data.sections;
        });
    }
});