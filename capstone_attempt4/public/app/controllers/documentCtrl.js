angular.module('documentControllers', ['documentServices'])

.controller('DocumentCtrl', ['$scope', 'documents', 'document', 'confirmFunc'],
 function($scope, documents, document, confirmFunc){
 	$scope.document = document;
 	$scope.elements = document.graph.elements;
 	$scope.undoStack = document.graph.undoStack;
 	//SKIPPING scope.isLoggedIn = auth.isLoggedIn for now
 	$scope.isTeacher = auth.accountType() == "teacher";//might need ===
 	$scope.isReadonly = $scope.document.status != 'unsubmitted';

 	//Updates the grade for the document
 	$scope.updateGrade = function() {
 		var newGrade = prompt("Enter a Grade", "");
 		if(newGrade === '' || isNaN(newGrade)) {
 			alert("Invalid grade.");
 			return;
 		}
 		else if(newGrade == null){
 			return;
 		}
 		//then passing the data to factory, interfaces with the backend
 		documents.updateGrade(document, newGrade);
 	};

 	//Warning about unsaved work


 }

/*
//DELETE LATER,
//from userCtrl file
//
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
});

*/

