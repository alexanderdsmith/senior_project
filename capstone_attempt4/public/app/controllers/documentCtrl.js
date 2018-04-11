angular.module('documentControllers', ['documentServices'])

.controller('DocumentCtrl', ['documents', 'document', 'confirmFunc', 'Auth', 'window'],
 function(documents, document, confirmFunc, Auth, window){
	var app = this;

    //This function is added to an event listener to be called when attempting to leave the document graphing page
    var confirmFunc = function (e) {
        var confirmationMessage = "All unsaved changes will be lost.";

        (e || window.event).returnValue = confirmationMessage; //Gecko + IE
        return confirmationMessage; //Webkit, Safari, Chrome
    }

    app.biographObj = {dirty: false}; //used for the graphing page

 	app.document = document;
 	app.elements = document.graph.elements;
 	app.undoStack = document.graph.undoStack;
 	app.isLoggedIn = Auth.isLoggedIn();
 	Auth.getUser().then(function(data) {
 		app.isStudent = data.usertypes.indexOf('student') !== -1;
 		app.isTa      = data.usertypes.indexOf('ta')      !== -1;
 		app.isTeacher = data.usertypes.indexOf('teacher') !== -1;
	});
 	app.isReadonly = this.document.status !== 'unsubmitted';

 	//Updates the grade for the document
 	this.updateGrade = function() {
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

 	//Warning about unsaved work on back button
    app.$on('$locationChangeStart', function(event) {
        if (!this.biographObj.dirty) { return; }
        //CHANGE THIS.BIOGRAPHOBJ TO APP.DIRTY?
        if (!confirm("Are you sure you want to leave this page? All unsaved changes will be lost.")) {
            event.preventDefault();
        }
    });

    //CHANGE EVENT PREVENT DEFAULT (BREAKS EVENT LISTENERS?)


    //loading cytoscape, getting dirty bit from it
    documents.loadCytoScape(document, this.isReadonly, function(dirty){
        if(dirty){
            window.addEventListener("beforeunload", confirmFunc);
        }
        else {
            window.removeEventListener("beforeunload", confirmFunc);
        }
        this.biographObj.dirty = dirty;
        //CHANGE THIS.BIOGRAPHOBJ.DIRTY TO APP?
    });

});
