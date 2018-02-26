angular.module('documentServices', [])

.factory('documents', ['$http', '$state'] function($http, $state) {
    var o ={ documents: [] };

    //Getting all students documents
    o.getAll = function(){
    	return $http.get('/student/documents', {
    		//LATER: check the auth.getToken function
    	}).success(function(data){
    		angular.copy(data, o.documents);
    	});
    };

    //Gets a single one of the student's documents
    o.getDocument = function(id){
    	return $http.get('/student/documents/' + id, {
    		//LATER: check the auth.getToken function
    	}).then(function(res){
    		return res.data;
    	});
    };


    //Gets a single submitted document to teacher's assignment
    o.getDocumentForTeacher = function(id) {
    	return $http.get('/student/documents/submissions/' + id, {
    		//LATER: check the auth.getToken function
    	}).then(function(res){
    		return res.data;
    	});
    };


    //Deletes a document and removes from student's list of documents
    o.deleteDocument = function(document) {
    	return $http.delete('/student/documents/' + document._id, {
    		//LATER: check the auth.getToken function
    	}).success(function(deletedDocument){
    		o.documents.splice(o.documents.findIndex(function(doc){
    			doc._id = deletedDocument._id;
    		}), 1);//splice (remove) 1 document
    		var dataToSend = {student: /*Not sure about auth.currentEmail() here*/, documentId: document._id};
    		$http.put('/student/documents/remove', dataToSend, {
    			//LATER: check the auth.getToken function
    		});

    		$state.go($state.current, {}, {reload: true}); //reload the page
    		return deletedDocument;
    	});
    };


    //Adds a new document to the student's document list
    


/*
	// DELETE LATER,
	//from userfactory
	//
    // User.create(regData)
    userFactory.create = function(regData) {
        return $http.post('/api/users', regData);
    };

    return userFactory;
    */
});