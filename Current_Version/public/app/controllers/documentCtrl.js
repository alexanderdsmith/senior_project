angular.module('documentControllers', ['documentServices'])

.controller('documentCtrl',function($window) {
    var app = this;

        var cy = cytoscape({
            container: document.getElementById('cy'),
            style: [
                {       // styling for nodes
                    selector: 'node',
                    style: {
                        'shape': 'rectangle',
                        "text-valign": "center",
                        "text-halign": "center",
                        'label': 'data(label)',
                        //'padding': 5,
                        'width': 'data(width)'
                        //'padding': 10px
                    }
                },
                {       // styling for edges
                    selector: 'edge',
                    style: {
                        'curve-style': 'bezier',
                        'target-arrow-shape': 'triangle',
                        'label': 'data(label)',
                        'text-outline-width': 2.5,
                        "text-outline-color": "#f4f8ff"
                    }
                }],

            elements: [
                /*{ data: { id: 'a' } },
                { data: { id: 'b' } },
                { data: { id: 'c'} },
                {
                    data: {
                        id: 'ab',
                        source: 'a',
                        target: 'b'
                    }
                }*/]
        });


        /**************************/
        /***** GET TEXT WIDTH *****/
        /**************************/

        // returns the width of inputted text
        function getTextWidth(text, font) {
            // re-use canvas object for better performance
            var canvas = getTextWidth.canvas || (getTextWidth.canvas = document.createElement("canvas"));
            var context = canvas.getContext("2d");
            context.font = font;
            var metrics = context.measureText(text);
            return metrics.width;
        }

        // uses getTextWidth() to set a node's width based on its label
        function handleWidth(target, label) {
            var width = getTextWidth(label, 'normal 16px helvetica');
            if ((width + 20) < 50) {
                target.data('width', 60);
            }
            else {
                target.data('width', width + 20);
            }
        }


        //$(function () {
        $('#toolbar').w2toolbar({
            name: 'toolbar',
            items: [
                {type: 'button', id: 'addNode', text: 'Add Node'},
                {type: 'button', id: 'addEdge', text: 'Add Edge'},
                {type: 'break'},
                {type: 'button', id: 'editLabel', text: 'Edit Label', disabled: true},
                {type: 'button', id: 'delete', text: 'Delete', disabled: true},
                {type: 'button', id: 'save', text: 'Save'}
            ],
            //onClick: function (event) {
            //    console.log('Target: '+ event.target, event);
            //}
        });
        //});

        var tb = w2ui['toolbar'];
        var items = tb['items'];


        /***************************/
        /***** ID Book-keeping *****/
        /***************************/
        // used to ensure no ID collision occurs when using undoStack/redoStack

        // increment functions are called whenever a node/edge is created, so
        // there is never a collision between a deleted item on the undo stack
        // and an item created later on (e.g. whenever you create a node it is
        // always a higher ID than any other node that has been created so far)

        var globalNodeID = "n0";
        var globalEdgeID = "e0";

        function incrementNodeID() {
            var num = parseInt(globalNodeID.substring(1), 10);
            num++;
            globalNodeID = "n" + num.toString();
        }

        function incrementEdgeID() {
            var num = parseInt(globalEdgeID.substring(1), 10);
            num++;
            globalEdgeID = "e" + num.toString();
        }

        /*var globalNodeID = 1//"";
        var globalEdgeID = 1//"";

        function incrementNodeID() {
            var num = globalNodeID;
            num++;
            globalNodeID = num;
            //var num = parseInt(globalNodeID.substring(1));
            //num++;
            //globalNodeID = "n" + num.toString();
        }

        function incrementEdgeID() {
            var num = globalEdgeID;
            num++;
            globalEdgeID = num;
            //var num = parseInt(globalEdgeID.substring(1));
            //num++;
            //globalEdgeID = "e" + num.toString();
        }*/


        //cy.add({
        //    data: { id: 'node' }
        //})


        /****************************************************/
        /***** HANDLE GRAY-OUT OF EDIT LABEL AND DELETE *****/
        /****************************************************/
        cy.on("select", toolbarSelectHandler);
        cy.on("unselect", toolbarUnselectHandler);

        function toolbarSelectHandler(event) {
            tb.enable("editLabel");
            tb.enable("delete");
        }

        function toolbarUnselectHandler(event) {
            tb.disable("editLabel");
            tb.disable("delete");
        }


        /**********************************/
        /***** TOOLBAR EVENT HANDLERS *****/

        /**********************************/
        function addNode_Listener(event) {
            // if the click was on the canvas, add node at the click position
            if (!(event.target.length > 0)) {
                addNode(event.renderedPosition.x, event.renderedPosition.y);
            }
        }

        var source;
        var dest;

        function addEdge_Listener(event) {
            if (source == "") { // if there isn't a source node yet
                source = this.id();
            }
            else { // else there is already a source node
                dest = this.id();
                addEdge(source, dest);

                source = "";
                dest = "";
            }
        }

        function editLabel_Handler() {
            // ensuring only one element is selected
            var selectedElems = cy.$(':selected');
            if (selectedElems.length == 1) {
                editLabel(selectedElems[0]);
            }
            else if (selectedElems.length > 1) {
                alert("You can only edit one label at a time!");
            }
        }

        // used for editing labels with double click
        //not being used currently
        function editLabel_ListenerDBL(event) {
            var targ = event.target;
            editLabel(targ);
        }


        /***************************/
        /***** TOOLBAR ONCLICK *****/
        /***************************/
        // Handles clicking buttons on the toolbar
        w2ui.toolbar.on('click', function (event) {
            var targ = tb.get(event.target); // get the clicked button

            // Any time a button is clicked, turn off any listeners that may have
            // previously been created
            cy.off('click', addNode_Listener);
            cy.off('click', 'node', addEdge_Listener);

            // making sure only one button can be checked at a time
            for (var i = 0; i < items.length; i++) {
                if (items[i].id != event.target) {
                    tb.uncheck(items[i].id);
                }
            }

            if (targ.checked != true) {
                switch (event.target) {
                    case ("addNode"): // Add Node
                        var selectedElements = cy.$('node:selected, edge:selected');
                        selectedElements.unselect();

                        cy.on('click', addNode_Listener);
                        break;
                    case ("addEdge"): // Add Edge
                        var selectedElements = cy.$('node:selected, edge:selected');
                        selectedElements.unselect();

                        source = "";
                        dest = "";

                        cy.on('click', 'node', addEdge_Listener);
                        break;
                    case ("editLabel"): // Edit Label
                        editLabel_Handler();
                        break;
                    case ("delete"): // Delete Selected
                        deleteSelected();
                        break;
                    //case ("undo"): // Undo
                    //    undo();
                    //    break;
                    //case ("redo"): // Redo
                    //    redo();
                    //    break;
                    case ("save"): // Save
                        //TODO: Save the graph

                        //saveGraph();
                        break;
                    //case ("fit"): // Fit
                    //    cy.fit(cy.$('node'), 100);
                    //    break;
                    //case ("item9"): // Print Undo stack
                    //    for (var i = 0; i < undoStack.length; i++) {
                    //        console.log(undoStack[i]);
                    //    }
                    //    break;
                }
            }
            else { // if unchecking an item
                switch (event.target) {
                    case ("addNode"): // Add Node
                        cy.off('click', addNode_Listener);
                        break;
                    case ("addEdge"): // Add Edge
                        cy.off('click', 'node', addEdge_Listener);
                        break;
                }
            }
        });

        /***** ADD NODE *****/
        function addNode(posX, posY) {
            incrementNodeID();

            cy.add({
                group: "nodes",
                //data: { id: 100, label: "", width: 60 },
                data: {id: globalNodeID, label: "", width: 60},
                renderedPosition: {x: posX, y: posY}
            });
            var node = cy.getElementById(globalNodeID);
            //var node = cy.getElementById(100);

            // UNDO INFO
            //lastEvent = { type: "addNode", target: node, time: getTimeStamp() };
            //undoStack.push(lastEvent);
            //tb.enable("undo"); // enable "undo" button on toolbar

            // EMPTY REDO STACK
            //redoStack = [];
            //tb.disable("redo"); // disable "redo" button on toolbar

            // HANDLE DIRTY BIT
            //setDirty();
        }

        /***** ADD EDGE *****/
        function addEdge(src, dst) {
            incrementEdgeID();
            cy.add({
                group: "edges",
                //data: { id: 50, source: src, target: dst, label: "" }
                data: {id: globalEdgeID, source: src, target: dst, label: ""}
            });
            var edge = cy.getElementById(globalEdgeID);
            //var edge = cy.getElementById(50);

            // UNDO INFO
            //lastEvent = { type: "addEdge", target : edge, time: getTimeStamp() };
            //undoStack.push(lastEvent);
            //tb.enable("undo"); // enable "undo" button on toolbar

            // EMPTY REDO STACK
            //redoStack = [];
            //tb.disable("redo"); // disable "redo" button on toolbar

            // HANDLE DIRTY BIT
            //setDirty();
        }

        /***** EDIT LABEL *****/
        function editLabel(target) {
            oldLabel = target.data('label');
            var newLabel = prompt("Enter new label", target.data('label'));

            // Checking if prompt was cancelled or new label is same as old label
            if (newLabel === null || newLabel === false || newLabel == oldLabel) { // If cancelled
                return;
            }
            else { // If not cancelled
                handleWidth(target, newLabel);
                target.json({data: {label: newLabel}});

                // UNDO INFO
                //lastEvent = { type: "editLabel", target: target, time: getTimeStamp(), oldLabel: oldLabel };
                //undoStack.push(lastEvent);
                //tb.enable("undo"); // enable "undo" button on toolbar

                // EMPTY REDO STACK
                //redoStack = [];
                //tb.disable("redo"); // disable "redo" button on toolbar

                // HANDLE DIRTY BIT
                //setDirty();
            }
        }

        /***** DELETE SELECTED *****/
        function deleteSelected() {
            // Get selected nodes and select their connected edges
            var selectedNodes = cy.$('node:selected');
            var connectedEdges = selectedNodes.connectedEdges();
            connectedEdges.select();

            // Get and remove all selected elements
            var selectedElements = cy.$('node:selected, edge:selected');
            selectedElements.unselect();
            cy.remove(selectedElements);

            // UNDO INFO
            //lastEvent = { type: "deleteSelected", target: selectedElements, time: getTimeStamp() };
            //undoStack.push(lastEvent);
            //tb.enable("undo"); // enable "undo" button on toolbar

            // EMPTY REDO STACK
            //redoStack = [];
            //tb.disable("redo"); // disable "redo" button on toolbar

            // HANDLE DIRTY BIT
            //setDirty();
        }
});
