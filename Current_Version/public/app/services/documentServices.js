angular.module('documentServices', [])

.factory('Documents', ['$http', function($http) {
    var documentsFactory = {};

    documentsFactory.getDocument = function(id) {
        return $http.post('/api/getDocument', id).then(function(data) {
            return data;
        });
    };

    documentsFactory.feedback = function(data) {
        return $http.post('/api/feedbackDocument', data).then(function(data) {
            return data;
        });
    };

    // Saves changes to a specific graph
    documentsFactory.updateDocument = function(saveData) {
        return $http.post('/api/saveDocument', saveData).then(function(data){
            return data;
        }).catch(function(returnedData) {
            return returnedData;
        });
    };

    documentsFactory.submit = function(id) {
        return $http.post('/api/submitDocument', id).then(function(data) {
            return data;
        });
    };

    /*documentsFactory.saveDocument = function(document) {
        return http.post('', document).then(function(data) {
            return data;
        });
    };*/

    // //Getting all students documents
    // documentsFactory.getAll = function(){
    //     return $http.get('/api/student/documents', {
    //         headers: {Authorization: 'Bearer '+AuthToken.getToken()}
    //     }).success(function(data){
    //         angular.copy(data, o.documents); //copying data to o.documents
    //     });
    // };

    // //Gets a single one of the student's documents
    // o.getDocument = function(id){
    //     return $http.get('/api/student/documents/' + id, {
    //         headers: {Authorization: 'Bearer '+AuthToken.getToken()}
    //     }).then(function(res){
    //         return res.data;
    //     });
    // };


    // //Gets a single submitted document to teacher's assignment
    // o.getDocumentForTeacher = function(id) {
    //     return $http.get('/api/student/documents/submissions/' + id, {
    //         headers: {Authorization: 'Bearer '+AuthToken.getToken()}
    //     }).then(function(res){
    //         return res.data;
    //     });
    // };


    // //Deletes a document and removes from student's list of documents
    // o.deleteDocument = function(document) {
    //     return $http.delete('/api/student/documents/' + document._id, {
    //         headers: {Authorization: 'Bearer '+AuthToken.getToken()}
    //     }).success(function(deletedDocument){
    //         o.documents.splice(o.documents.findIndex(function(doc){
    //             doc._id = deletedDocument._id;
    //         }), 1);//splice (remove) 1 document
    //         var dataToSend = {student: Auth.currentEmail() /* TODO Not sure about auth.currentEmail() here*/, documentId: document._id};
    //         $http.put('/api/student/documents/remove', dataToSend, {
    //             headers: {Authorization: 'Bearer '+AuthToken.getToken()}
    //         });

    //         $route.reload(); //$state.go($state.current, {}, {reload: true}); //reload the page
    //         return deletedDocument;
    //     });
    // };

    // // Adds a new document to the student's document list
    // o.addDocument = function(newDocTitle, graphData) {
    //     var dataToSend = { title: newDocTitle, graph: graphData };
    //     return $http.post('/api/student/documents', dataToSend, {
    //         headers: {Authorization: 'Bearer '+AuthToken.getToken()}
    //     }).success(function(document) {
    //         o.documents.push(document);

    //         $route.reload(); //$state.go($state.current, {}, {reload: true}); // reload the page

    //         return document;
    //     });
    // };

    // // Renames a document
    // o.renameDocument = function(document, newTitle) {
    //     var dataToSend = { title: newTitle };
    //     return $http.put('/api/student/documents/' + document._id + '/title', dataToSend, {
    //         headers: {Authorization: 'Bearer '+AuthToken.getToken()}
    //     }).success(function(returnedData) {
    //         $route.reload(); //$state.go($state.current, {}, {reload: true}); // reload the page
    //     });
    // };

    // // Updates the grade of single submitted document to the teacher's assignment
    // o.updateGrade = function(document, grade) {
    //     var dataToSend = { document: document._id, grade: grade };
    //     return $http.put('/api/teacher/assignments/' + document.submittedTo + '/submission/grade', dataToSend, {
    //         headers: {Authorization: 'Bearer '+AuthToken.getToken()}
    //     }).success(function(returnedData) {
    //     $route.reload(); //$state.go($state.current, {}, {reload: true}); // reload the page
    //     return returnedData;
    // });
    // };

    // // Saves changes to a specific graph
    // o.updateGraph = function(document, data) {
    //     return $http.put('/api/student/documents/' + document._id + '/graph', data, {
    //         headers: {Authorization: 'Bearer '+AuthToken.getToken()}
    //     }).success(function(returnedData) {
    //         document.graph.elements = returnedData.elements;
    //         document.graph.undoStack = returnedData.undoStack;
    //         return returnedData;
    //     });
    // };

    // // Loads the graphing page. This is where all of the CytoScape JS logic goes
    // o.loadCytoScape = function() {
    //     var cy = cytoscape({
    //         container: document.getElementById('cy'),
    //         style: [
    //             {       // styling for nodes
    //                 selector: 'node',
    //                 style: {
    //                     'shape': 'rectangle',
    //                     "text-valign" : "center",
    //                     "text-halign" : "center",
    //                     'label': 'data(label)',
    //                     //'padding': 5,
    //                     'width': 'data(width)'
    //                     //'padding': 10px
    //                 }
    //             },
    //             {       // styling for edges
    //                 selector: 'edge',
    //                 style: {
    //                     'curve-style': 'bezier',
    //                     'target-arrow-shape': 'triangle',
    //                     'label': 'data(label)',
    //                     'text-outline-width': 2.5,
    //                     "text-outline-color": "#f4f8ff"
    //                 }
    //             }],

    //         elements: [
    //             /*{ data: { id: 'a' } },
    //             { data: { id: 'b' } },
    //             { data: { id: 'c'} },
    //             {
    //                 data: {
    //                     id: 'ab',
    //                     source: 'a',
    //                     target: 'b'
    //                 }
    //             }*/]
    //     });



    //     /**************************/
    //     /***** GET TEXT WIDTH *****/
    //     /**************************/
    //     // returns the width of inputted text
    //     function getTextWidth(text, font) {
    //         // re-use canvas object for better performance
    //         var canvas = getTextWidth.canvas || (getTextWidth.canvas = document.createElement("canvas"));
    //         var context = canvas.getContext("2d");
    //         context.font = font;
    //         var metrics = context.measureText(text);
    //         return metrics.width;
    //     }

    //     // uses getTextWidth() to set a node's width based on its label
    //     function handleWidth(target, label) {
    //         var width = getTextWidth(label, 'normal 16px helvetica');
    //         if ((width + 20) < 50) {
    //             target.data('width', 60);
    //         }
    //         else {
    //             target.data('width', width + 20);
    //         }
    //     }



    //     //$(function () {
    //     $('#toolbar').w2toolbar({
    //         name: 'toolbar',
    //         items: [
    //             { type: 'button', id: 'addNode', text: 'Add Node' },
    //             { type: 'button', id: 'addEdge', text: 'Add Edge' },
    //             { type: 'break' },
    //             { type: 'button', id: 'editLabel', text: 'Edit Label', disabled: true },
    //             { type: 'button', id: 'delete', text: 'Delete', disabled: true },
    //             { type: 'button', id: 'save', text: 'Save'}
    //         ],
    //         //onClick: function (event) {
    //         //    console.log('Target: '+ event.target, event);
    //         //}
    //     });
    //     //});

    //     var tb = w2ui['toolbar'];
    //     var items = tb['items'];



    //     /***************************/
    //     /***** ID Book-keeping *****/
    //     /***************************/
    //     // used to ensure no ID collision occurs when using undoStack/redoStack

    //     // increment functions are called whenever a node/edge is created, so
    //     // there is never a collision between a deleted item on the undo stack
    //     // and an item created later on (e.g. whenever you create a node it is
    //     // always a higher ID than any other node that has been created so far)

    //     var globalNodeID = "n0";
    //     var globalEdgeID = "e0";

    //     function incrementNodeID() {
    //         var num = parseInt(globalNodeID.substring(1), 10);
    //         num++;
    //         globalNodeID = "n" + num.toString();
    //     }

    //     function incrementEdgeID() {
    //         var num = parseInt(globalEdgeID.substring(1), 10);
    //         num++;
    //         globalEdgeID = "e" + num.toString();
    //     }

    //     /*var globalNodeID = 1//"";
    //     var globalEdgeID = 1//"";

    //     function incrementNodeID() {
    //         var num = globalNodeID;
    //         num++;
    //         globalNodeID = num;
    //         //var num = parseInt(globalNodeID.substring(1));
    //         //num++;
    //         //globalNodeID = "n" + num.toString();
    //     }

    //     function incrementEdgeID() {
    //         var num = globalEdgeID;
    //         num++;
    //         globalEdgeID = num;
    //         //var num = parseInt(globalEdgeID.substring(1));
    //         //num++;
    //         //globalEdgeID = "e" + num.toString();
    //     }*/


    //     //cy.add({
    //     //    data: { id: 'node' }
    //     //})




    //     /****************************************************/
    //     /***** HANDLE GRAY-OUT OF EDIT LABEL AND DELETE *****/
    //     /****************************************************/
    //     cy.on("select", toolbarSelectHandler);
    //     cy.on("unselect", toolbarUnselectHandler);

    //     function toolbarSelectHandler(event) {
    //         tb.enable("editLabel");
    //         tb.enable("delete");
    //     }

    //     function toolbarUnselectHandler(event) {
    //         tb.disable("editLabel");
    //         tb.disable("delete");
    //     }





    //     /**********************************/
    //     /***** TOOLBAR EVENT HANDLERS *****/
    //     /**********************************/
    //     function addNode_Listener(event) {
    //         // if the click was on the canvas, add node at the click position
    //         if (!(event.target.length > 0)) {
    //             addNode(event.renderedPosition.x, event.renderedPosition.y);
    //         }
    //     }

    //     var source;
    //     var dest;
    //     function addEdge_Listener(event) {
    //         if (source == "") { // if there isn't a source node yet
    //             source = this.id();
    //         }
    //         else { // else there is already a source node
    //             dest = this.id();
    //             addEdge(source, dest);

    //             source = "";
    //             dest = "";
    //         }
    //     }

    //     function editLabel_Handler() {
    //         // ensuring only one element is selected
    //         var selectedElems = cy.$(':selected');
    //         if (selectedElems.length == 1) {
    //             editLabel(selectedElems[0]);
    //         }
    //         else if (selectedElems.length > 1) { alert("You can only edit one label at a time!"); }
    //     }

    //     // used for editing labels with double click
    //     //not being used currently
    //     function editLabel_ListenerDBL(event) {
    //         var targ = event.target;
    //         editLabel(targ);
    //     }


    //     /***************************/
    //     /***** TOOLBAR ONCLICK *****/
    //     /***************************/
    //     // Handles clicking buttons on the toolbar
    //     w2ui.toolbar.on('click', function(event) {
    //         var targ = tb.get(event.target); // get the clicked button

    //         // Any time a button is clicked, turn off any listeners that may have
    //         // previously been created
    //         cy.off('click', addNode_Listener);
    //         cy.off('click', 'node', addEdge_Listener);

    //         // making sure only one button can be checked at a time
    //         for (var i = 0; i < items.length; i++) {
    //             if (items[i].id != event.target) { tb.uncheck(items[i].id); }
    //         }

    //         if (targ.checked != true) {
    //             switch (event.target) {
    //                 case ("addNode"): // Add Node
    //                     var selectedElements = cy.$('node:selected, edge:selected');
    //                     selectedElements.unselect();

    //                     cy.on('click', addNode_Listener);
    //                     break;
    //                 case ("addEdge"): // Add Edge
    //                     var selectedElements = cy.$('node:selected, edge:selected');
    //                     selectedElements.unselect();

    //                     source = "";
    //                     dest = "";

    //                     cy.on('click', 'node', addEdge_Listener);
    //                     break;
    //                 case ("editLabel"): // Edit Label
    //                     editLabel_Handler();
    //                     break;
    //                 case ("delete"): // Delete Selected
    //                     deleteSelected();
    //                     break;
    //                 //case ("undo"): // Undo
    //                 //    undo();
    //                 //    break;
    //                 //case ("redo"): // Redo
    //                 //    redo();
    //                 //    break;
    //                 case ("save"): // Save
    //                     //TODO: Save the graph

    //                     //saveGraph();
    //                     break;
    //                 //case ("fit"): // Fit
    //                 //    cy.fit(cy.$('node'), 100);
    //                 //    break;
    //                 //case ("item9"): // Print Undo stack
    //                 //    for (var i = 0; i < undoStack.length; i++) {
    //                 //        console.log(undoStack[i]);
    //                 //    }
    //                 //    break;
    //             }
    //         }
    //         else { // if unchecking an item
    //             switch (event.target) {
    //                 case ("addNode"): // Add Node
    //                     cy.off('click', addNode_Listener);
    //                     break;
    //                 case ("addEdge"): // Add Edge
    //                     cy.off('click', 'node', addEdge_Listener);
    //                     break;
    //             }
    //         }
    //     });








    //     /***** ADD NODE *****/
    //     function addNode(posX, posY) {
    //         incrementNodeID();

    //         cy.add({
    //             group: "nodes",
    //             //data: { id: 100, label: "", width: 60 },
    //             data: { id: globalNodeID, label: "", width: 60 },
    //             renderedPosition: { x: posX, y: posY }
    //         });
    //         var node = cy.getElementById(globalNodeID);
    //         //var node = cy.getElementById(100);

    //         // UNDO INFO
    //         //lastEvent = { type: "addNode", target: node, time: getTimeStamp() };
    //         //undoStack.push(lastEvent);
    //         //tb.enable("undo"); // enable "undo" button on toolbar

    //         // EMPTY REDO STACK
    //         //redoStack = [];
    //         //tb.disable("redo"); // disable "redo" button on toolbar

    //         // HANDLE DIRTY BIT
    //         //setDirty();
    //     }

    //     /***** ADD EDGE *****/
    //     function addEdge(src, dst) {
    //         incrementEdgeID();
    //         cy.add({
    //             group: "edges",
    //             //data: { id: 50, source: src, target: dst, label: "" }
    //             data: { id: globalEdgeID, source: src, target: dst, label: "" }
    //         });
    //         var edge = cy.getElementById(globalEdgeID);
    //         //var edge = cy.getElementById(50);

    //         // UNDO INFO
    //         //lastEvent = { type: "addEdge", target : edge, time: getTimeStamp() };
    //         //undoStack.push(lastEvent);
    //         //tb.enable("undo"); // enable "undo" button on toolbar

    //         // EMPTY REDO STACK
    //         //redoStack = [];
    //         //tb.disable("redo"); // disable "redo" button on toolbar

    //         // HANDLE DIRTY BIT
    //         //setDirty();
    //     }

    //     /***** EDIT LABEL *****/
    //     function editLabel(target) {
    //         oldLabel = target.data('label');
    //         var newLabel = prompt("Enter new label", target.data('label'));

    //         // Checking if prompt was cancelled or new label is same as old label
    //         if (newLabel === null || newLabel === false || newLabel == oldLabel) { // If cancelled
    //             return;
    //         }
    //         else { // If not cancelled
    //             handleWidth(target, newLabel);
    //             target.json({ data: { label: newLabel } });

    //             // UNDO INFO
    //             //lastEvent = { type: "editLabel", target: target, time: getTimeStamp(), oldLabel: oldLabel };
    //             //undoStack.push(lastEvent);
    //             //tb.enable("undo"); // enable "undo" button on toolbar

    //             // EMPTY REDO STACK
    //             //redoStack = [];
    //             //tb.disable("redo"); // disable "redo" button on toolbar

    //             // HANDLE DIRTY BIT
    //             //setDirty();
    //         }
    //     }

    //     /***** DELETE SELECTED *****/
    //     function deleteSelected() {
    //         // Get selected nodes and select their connected edges
    //         var selectedNodes = cy.$('node:selected');
    //         var connectedEdges = selectedNodes.connectedEdges();
    //         connectedEdges.select();

    //         // Get and remove all selected elements
    //         var selectedElements = cy.$('node:selected, edge:selected');
    //         selectedElements.unselect();
    //         cy.remove(selectedElements);

    //         // UNDO INFO
    //         //lastEvent = { type: "deleteSelected", target: selectedElements, time: getTimeStamp() };
    //         //undoStack.push(lastEvent);
    //         //tb.enable("undo"); // enable "undo" button on toolbar

    //         // EMPTY REDO STACK
    //         //redoStack = [];
    //         //tb.disable("redo"); // disable "redo" button on toolbar

    //         // HANDLE DIRTY BIT
    //         //setDirty();
    //     }

    // };

    return documentsFactory;

}]);
