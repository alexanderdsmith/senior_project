angular.module('userControllers', ['userServices'])

.controller('localStrategyCtrl', function($location, $timeout, User) {

    var app = this;

    this.registerUser = function(regData) {
        app.loading = true;
        app.errorMessage = false;
        User.create(this.regData).then(function(data) {
            if(data.data.success === true) {
                // success message
                app.loading = false;
                app.successMessage = data.data.message + ' Redirecting...';
                $timeout(function() {
                    $location.path('/');
                }, 2000);
            } else {
                // error message
                app.loading = false;
                app.errorMessage = data.data.message;
            }
        });
    }
})

.controller('googleStrategyCtrl', function($routeParams, Auth, $location, $window) {

    var app = this;

    app.errorMessage = false;

    if($window.location.pathname === '/google-error') {
        app.errorMessage = 'Google account not registered';
    } else {
        Auth.google($routeParams.token);
        $location.path('/');
    }
})

.controller('userActionCtrl', ['$scope', function($scope) {
    $scope.addAssignment = function(){
        $scope.currentAssignments.push({
            name: $scope.currentAssignments.name,
            dueDate: $scope.currentAssignments.dueDate
        });
        $scope.currentAssignments.name = "";
        $scope.currentAssignments.dueDate = "";
    };

    $scope.addAnnouncement = function(){
        $scope.announcements.push({
            text: $scope.announcements.text
        });
        $scope.announcements.text = "";
    };

    $scope.removeAssignment = function(assignment){
        var removedAssignment = $scope.currentAssignments.indexOf(assignment);
        $scope.currentAssignments.splice(removedAssignment, 1);
    };

    $scope.removeAnnouncement = function(announcement){
        var removedAnnouncement = $scope.announcements.indexOf(announcement);
        $scope.announcements.splice(removedAnnouncement, 1);
    };

    $scope.sections = [
        {
            name: "Example",
            instructor: "Example",
            time: "10am"
        }
    ];

    $scope.currentAssignments = [
        {
            name: 'Number 1',
            dueDate: 'Feb 25th'
        }
    ];

    $scope.pastAssignments = [];
    $scope.announcements = [{
        text: 'Hello'
    }];
}]);

