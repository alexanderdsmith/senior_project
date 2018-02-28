angular.module('documentControllers', ['documentServices'])

.controller('DocumentCtrl', ['documents', 'document', 'confirmFunc', 'Auth'],
 function(documents, document, confirmFunc, Auth){
	var app = this;

 	app.document = document;
 	app.elements = document.graph.elements;
 	app.undoStack = document.graph.undoStack;
 	//SKIPPING app.isLoggedIn = Auth.isLoggedIn() for now
 	app.isTeacher = Auth.accountType() === "teacher";
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
        if (!confirm("Are you sure you want to leave this page? All unsaved changes will be lost.")) {
            event.preventDefault();
        }
    });


    //loading cytoscape, getting dirty bit from it
    documents.loadCytoScape(document, this.isReadonly, function(dirty){
        if(dirty){
            window.addEventListener("beforeunload", confirmFunc);
        }
        else {
            window.removeEventListener("beforeunload", confirmFunc);
        }
        this.biographObj.dirty = dirty;
    });

});
