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
    /***************************/
    /****** EMMETT'S CODE ******/
    /***************************/
    this.getSections = function() {
        Profile.pullSections().then(function(data) {
            app.sections = data.data.sections;
        });
    };

    this.addAssignment = function() {
        app.currentAssignments.push({
            name: app.currentAssignments.name,
            dueDate: app.currentAssignments.dueDate
        });
        app.currentAssignments.name = "";
        app.currentAssignments.dueDate = "";
    };

    this.addAnnouncement = function() {
        app.announcements.push({
            text: app.announcements.text
        });
        app.announcements.text = "";
    };

    this.addSection = function() {
        app.sections.push({
            name: app.sections.name,
            time: app.sections.time
        });

        app.sections.name = "";
        app.sections.time = "";
    };

    this.removeAssignment = function(assignment) {
        var removedAssignment = app.currentAssignments.indexOf(assignment);
        app.currentAssignments.splice(removedAssignment, 1);
    };

    this.removeAnnouncement = function(announcement) {
        var removedAnnouncement = app.announcements.indexOf(announcement);
        app.announcements.splice(removedAnnouncement, 1);
    };

    this.sections = [{
        name: "Example",
        instructor: "Example",
        time: "10am"
    }];

    this.currentAssignments = [{
        name: 'Number 1',
        dueDate: 'Feb 25th'
    }];

    this.pastAssignments = [];
    this.announcements = [{
        text: 'Hello'
    }];
});