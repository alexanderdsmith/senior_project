angular.module('sectionController',['sectionServices'])

.controller('sectionCtrl', function() {

    var app = this;

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