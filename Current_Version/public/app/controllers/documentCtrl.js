angular.module('documentControllers', ['documentServices'])

.controller('documentCtrl', ['Documents', '$routeParams', '$window', '$scope', function(Documents, $routeParams, $window, $scope) {
    var app = this;
    app.url = JSON.parse('{"' + decodeURI(atob($routeParams.param)).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g,'":"') + '"}');
    app.title = app.url.title;
    app.description = app.url.description;
    console.log(app.description);
    app.dirty = false;
    var windowListener = false;

    var submitFlag = 0; //changes to 1 when click submit button


    function backToCourse() {
        if (app.errorMessage) {
            alert(app.errorMessage);
        }
        if (app.successMessage) {
            alert(app.successMessage);
        }
        $window.history.back();

    }

    if(app.url !== null && app.url !== undefined) {
        Documents.getDocument({ id: app.url.id }).then(function(data) {
            app.document = data.data;
            app.id = app.document.id;
            app.grade = app.document.grade;
            app.feedback = app.document.feedback;
            app.status = app.document.status;
            app.submitTime = app.document.submitTime;
            app.isReadOnly = app.document.status !== 'unsubmitted';
            loadCytoscape(app.isReadOnly, app.document.graph, setDirtyBit);
        });
    } else {
        app.document = { errorMessage: "Document not found." };
    }

    /*window.onload = function() {
        window.addEventListener("beforeunload", function (e) {
            if(!app.dirty){
                return undefined;
            }
            var confirmationMessage = "All unsaved changes will be lost";

            (e || window.event).returnValue = confirmationMessage;
            return confirmationMessage;
        });
    };*/

    var confirmFunc = function(e) {
        var confirmationMessage = "All unsaved changes will be lost";

        (e || window.event).returnValue = confirmationMessage;
        return confirmationMessage;
    };

    $scope.$on('$locationChangeStart', function(event) {
        if(!app.dirty) {
            return;
        }
        if(app.dirty){
            if(!confirm("Are you sure you want to leave this page?  All unsaved changes will be lost.")){
                event.preventDefault();
            }
            else{
                if(windowListener){
                    window.removeEventListener("beforeunload", confirmFunc);
                }
                app.dirty = false;
            }
        }
    });

    function setDirtyBit(dirty) {
        if(dirty) {
            window.addEventListener("beforeunload", confirmFunc);
            windowListener = true;
        }
        else{
            if(windowListener){
                window.removeEventListener("beforeunload", confirmFunc);
            }
        }
        app.dirty = dirty;
    }

    this.updateFeedback = function() {
        var feedback = prompt("Please leave feedback: ", "Feedback");
        if(feedback === '')
            feedback = 'No feedback given.';
        var grade = parseInt(prompt("Please enter grade: ", "Grade"));
        if(grade === '' || isNaN(grade)) {
            alert('Please enter a grade!');
            return;
        }

        Documents.feedback({ id: app.id, feedback: feedback, grade: grade }).then(function(data) {
            if(data.data.success === true) {
                app.successMessage = data.data.message;
                app.grade = grade;
                app.feedback = feedback;
            } else {
                app.errorMessage = data.data.message;
            }
        });
    };

    function submitDoc(graphData) {
        graphData.doc_id = app.url.id;

        Documents.updateDocument(graphData).then(function(ddata) {
            if (ddata.data.success) {
                var submit = $window.confirm('Are you sure you want to submit this model?');
                if (submit) {
                    Documents.submit({id: app.id}).then(function (data) {
                        if (data.data.success === true) {
                            app.successMessage = data.data.message;
                            backToCourse();
                        } else {
                            app.errorMessage = data.data.message;
                        }
                    });
                }
                else{
                    submitFlag = 0; //submit cancelled, reset flag
                }
            }
        });
    }

    function updateDocument(graphData) {
        graphData.doc_id = app.url.id;

        Documents.updateDocument(graphData).then(function(data) {
            if (data.data.success === true) {
                app.successMessage = data.data.message;
                console.log(app.successMessage);
            }
            else {
                app.errorMessage = data.data.message;
            }
        });

    }

    this.updateTitle = function() {
        var newTitle = prompt("Enter a Title", "");
        if(newTitle === '') {
            alert("Invalid grade.");
            return;
        }

        this.title = newTitle;

        //then passing the data to factory, interfaces with the backend
        Documents.updateTitle(app.document, newTitle).then(function(data) {
            if(data.data.success === true) {
                app.successMessage = data.data.message;
            } else {
                app.errorMessage = data.data.message;
            }
        });
    };

    /*this.fetchDocument = function(id, ){

    }
    */



    /*function loadCytoscape(readOnly, docData) {*/
    function loadCytoscape(readOnly, docData, setDirtyBit) {

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
                        'width': 'data(width)',
                        'color': '#ffffff',
                        'text-outline-width': 1.5,
                        'text-outline-color': '#1f1f1f'
                        //'padding': 10px
                    }
                },
                {       // styling for edges
                    selector: 'edge',
                    style: {
                        'curve-style': 'bezier',
                        'target-arrow-shape': 'triangle',
                        'label': 'data(label)',
                        'text-outline-width': 1.5,
                        "text-outline-color": "#f4f8ff"
                    }
                },
                {
                    //styling for edge handle extension
                    selector: '.eh-handle',
                    style: {
                        'background-color': 'orange',
                        'width': 12,
                        'height': 12,
                        'border-width': 12,
                        'border-opacity': 0
                    }
                },
                {
                    //Selector for the source node
                    selector: '.eh-source',
                    style: {
                        'border-width': 2//,
                        //'border-color': 'red'
                    }
                /*},
                {
                    selector: '.eh-preview',
                    style: {
                        'background-color': 'red',
                        'line-color': 'red',
                        'target-arrow-color': 'red',
                        'source-arrow-color': 'red'
                    }*/
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
                }*/],
            zoom: 1.5,
            maxZoom: 3.5,
            minZoom: 0.7
        });

        var graph = document.getElementById("cy");

        var undoStack = new Array();

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

        // for edge handles, the values of each option are outlined below:
        var edgehandle_values = {
            preview: true, // whether to show added edges preview before releasing selection
            hoverDelay: 150, // time spent hovering over a target node before it is considered selected
            handleNodes: 'node', // selector/filter function for whether edges can be made from a given node
            handlePosition: function( node ){
                return 'middle top'; // sets the position of the handle in the format of "X-AXIS Y-AXIS" such as "left top", "middle top"
            },
            handleInDrawMode: false, // whether to show the handle in draw mode
            edgeType: function( sourceNode, targetNode ){
                // can return 'flat' for flat edges between nodes or 'node' for intermediate node between them
                // returning null/undefined means an edge can't be added between the two nodes
                return 'flat';
            },
            loopAllowed: function( node ){
                // for the specified node, return whether edges from itself to itself are allowed
                return false;
            },
            nodeLoopOffset: -50, // offset for edgeType: 'node' loops
            nodeParams: function( sourceNode, targetNode ){
                // for edges between the specified source and target
                // return element object to be passed to cy.add() for intermediary node
                return {};
            },
            edgeParams: function( sourceNode, targetNode, i ){
                // for edges between the specified source and target
                // return element object to be passed to cy.add() for edge
                // NB: i indicates edge index in case of edgeType: 'node'
                return {};
            },
            show: function( sourceNode ){
                // fired when handle is shown
            },
            hide: function( sourceNode ){
                // fired when the handle is hidden
            },
            start: function( sourceNode ){
                // fired when edgehandles interaction starts (drag on handle)
            },
            complete: function( sourceNode, targetNode, addedEles ){
                // fired when edgehandles is done and elements are added
                cy.remove(addedEles); //once edge handle complete, remove then add again
                var source = sourceNode.id();
                var target = targetNode.id();
                addEdge(source, target); //using addEdge for save and undo functionality

            },
            stop: function( sourceNode ){
                // fired when edgehandles interaction is stopped (either complete with added edges or incomplete)
            },
            cancel: function( sourceNode, cancelledTargets ){
                // fired when edgehandles are cancelled (incomplete gesture)
            },
            hoverover: function( sourceNode, targetNode ){
                // fired when a target is hovered
            },
            hoverout: function( sourceNode, targetNode ){
                // fired when a target isn't hovered anymore
            },
            previewon: function( sourceNode, targetNode, previewEles ){
                // fired when preview is shown
            },
            previewoff: function( sourceNode, targetNode, previewEles ){
                // fired when preview is hidden
            },
            drawon: function(){
                // fired when draw mode enabled
            },
            drawoff: function(){
                // fired when draw mode disabled
            }
        };


        var eh = cy.edgehandles(edgehandle_values);


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




        if(w2ui.hasOwnProperty('toolbar')){
            w2ui['toolbar'].destroy();
        }

        //$(function () {
        $('#toolbar').w2toolbar({
            name: 'toolbar',
            items: [
                {type: 'button', id: 'addNode', text: 'Add Box'},
                {type: 'button', id: 'addEdge', text: 'Add Arrow', disabled: true},
                {type: 'break'},
                {type: 'button', id: 'editLabel', text: 'Edit Label', disabled: true},
                {type: 'button', id: 'delete', text: 'Delete', disabled: true},
                {type: 'button', id: 'save', text: 'Save'},
                { type: 'break'},
                { type: 'button', id: 'undo', text: 'Undo'},
                { type: 'button', id: 'redo', text: 'Redo', disabled: true},
                { type: 'break'},
                { type: 'button', id: 'autofit', text: 'Auto-Fit'},
                { type: 'button', id: 'enableDraw', text: 'Enable Drawing', disabled: true},
                { type: 'button', id: 'disableDraw', text: 'Disable Drawing'},
                { type: 'break'},
                { type: 'button', id: 'submit', text: 'Submit Model'}
            ],
            //onClick: function (event) {
            //    console.log('Target: '+ event.target, event);
            //}
        });
        //});

        var tb = w2ui['toolbar'];
        var items = tb['items'];


        if(readOnly){
            eh.disable();
            cy.autoungrabify(true);
            cy.autounselectify(true);
            tb.disable("addNode", "addEdge", "editLabel", "delete", "save", "undo", "redo", "enableDraw", "disableDraw", "submit");
        }


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

        /**************************/
        /***** GET TIME STAMP *****/
        /**************************/
        function getTimeStamp() {
            var d = new Date(Date.now());
            var t = (d.getMonth()+1) + "-" + d.getDate() + "-" + d.getFullYear() + " " + d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();
            return t;
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
                    case ("undo"): // Undo
                        undo();
                        break;
                    case ("redo"): // Redo
                        redo();
                        break;
                    case ("save"): // Save
                        saveGraph();
                        break;
                    case ("autofit"): // Fit
                        cy.fit(cy.$('node'), 100);
                        break;
                    case ("enableDraw"):
                        eh.enable(); //enable edge handles (drawing edges)
                        //eh.enableDrawMode();
                        tb.disable("enableDraw");
                        tb.disable("addEdge");
                        tb.enable("disableDraw");
                        break;
                    case ("disableDraw"):
                        //console.log("Disabling drawing edges");
                        tb.enable("addEdge");
                        eh.disable(); //disable edge handles (disable drawing edges)
                        cy.remove('node.eh-handle');
                        tb.disable("disableDraw");
                        tb.enable("enableDraw");
                        break;
                    case ("submit"):
                        submitFlag = 1;
                        saveGraph(); //saveGraph function with flag set to 1
                        break;
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



        /**********************/
        /***** LOAD GRAPH *****/
        /**********************/
        //loadGraph(docArg.graph);
        //loadGraph(graphData);
        loadGraph(docData);
        function loadGraph(graph) {
            // HANDLE NODES AND EDGES //
            if (graph.elements != "") {
                cy.add(JSON.parse(graph.elements));
            }

            // HANDLE UNDO STACK //
            var undoItems = graph.undoStack;
            var deletedElems = [];

            // loop backwards so deleted elements are re-created before other undo
            // events use them as their target
            for (var i = undoItems.length-1; i >= 0; i--) {
                var undoItemTemp = JSON.parse(undoItems[i]);
                //console.log(undoItemTemp);

                var undoItem = {
                    type: undoItemTemp.type,
                    time: undoItemTemp.time
                };

                // handling oldlabel for "editLabel"
                if (undoItem.type == "editLabel") {
                    undoItem.oldLabel = undoItemTemp.oldLabel;
                }

                // handling "deleteSelected" case
                if (undoItemTemp.type == "deleteSelected") {
                    targStrings = [];
                    targElems = [];

                    // split target string into array of deleteSelected target strings
                    targStrings = undoItemTemp.target.split("<newelem>");

                    // loop through deleteSelected target strings
                    for (var j = 0; j < targStrings.length; j++) {
                        // parse deleteSelected target string into JSON
                        var targJSON = JSON.parse(targStrings[j]);

                        // add the JSON object
                        cy.add(targJSON);

                        // get the element by its ID
                        var elem = cy.getElementById(targJSON.data.id);

                        targElems.push(elem);
                        deletedElems.push(elem);
                    }
                    undoItem.target = targElems;
                }
                else {
                    //console.log(undoItemTemp.target);
                    targJSON = JSON.parse(undoItemTemp.target);
                    undoItem.target = cy.getElementById(targJSON.data.id);
                }

                undoStack[i] = undoItem;
            }

            // removing deletedElems after undo stack is completely loaded
            for (var i = 0; i < deletedElems.length; i++) {
                cy.remove(deletedElems[i]);
            }

            // setting global ID's
            globalNodeID = "n".concat(cy.nodes().length.toString());
            //globalNodeID = graph.globalNodeID;
            globalEdgeID = "e".concat(cy.edges().length.toString());
            //globalEdgeID = graph.globalEdgeID;

            // disable undo toolbar item if undoStack is empty
            if (undoStack.length == 0) {
                tb.disable("undo");
            }
        };




        var dirty;
        setClean();

        function setDirty() {
            if (!dirty) {
                dirty = true;
                setDirtyBit(true);
            }
            tb.enable("save");
        }

        function setClean() {
            dirty = false;
            setDirtyBit(false);
            tb.disable("save");
        }

        cy.on('drag', 'node', setDirty); //set dirty bit if node is dragged


        /*function updateGraph(elements, undoStack) {
            this.saveDocument(elements, undoStack);//take controller function

        }*/


        updateGraph = function(data) {
            console.log("Updating now inside cytoscape function");
            var graphData = {
                elements: data.elements,
                undoStack: data.undoStack
            };
            console.log(graphData);

            //send graph data to controller function to save
            updateDocument(graphData);

            console.log("Graph updated Controller cytoscape");
        };


        function saveGraph() {
            var selectedElements = cy.$('node:selected, edge:selected');
            cy.remove('node.eh-handle'); //remove all edge handles before save
            selectedElements.unselect();

            var undoStackJSON = [];

            for(var i=0; i<undoStack.length; i++) {
                undoStackJSON[i] = {};
                undoStackJSON[i].type = undoStack[i].type;
                undoStackJSON[i].time = undoStack[i].time;

                //handle case where delete has multiple targets
                if (undoStackJSON[i].type == "deleteSelected") {
                    undoStackJSON[i].target = "";
                    for (var j=0; j<undoStack[i].target.length; j++){
                        undoStackJSON[i].target += JSON.stringify(undoStack[i].target[j].json());
                        if (j!=undoStack[i].target.length-1) {
                            undoStackJSON[i].target += "<newelem>";
                        }
                    }
                }
                else {
                    //console.log(undoStack[i].target);
                    undoStackJSON[i].target = JSON.stringify(undoStack[i].target.json());
                }

                //save old label in JSON object for editLabel undoStack item
                if (undoStack[i].type == 'editLabel') {
                    undoStackJSON[i].oldLabel = undoStack[i].oldLabel;
                }

                undoStackJSON[i] = JSON.stringify(undoStackJSON[i]); //stringify JSON
            }



            //Sending graph data to controller through updateGraph function
            updateGraph({ elements: JSON.stringify(cy.elements().jsons()), undoStack: undoStackJSON });

            if(submitFlag){ //if submit button is clicked, call submitDoc controller function
                submitDoc({ elements: JSON.stringify(cy.elements().jsons()), undoStack: undoStackJSON });
            }


            //Handle Dirty bit
            setClean();
        }




        /* UNDO */
        var lastEvent;
        function undo() {
            var event = undoStack.pop();
            var targ = event.target;

            targ.unselect();

            if(undoStack.length==0) {
                tb.disable("undo");
            }

            if(event.type == "editLabel") {
                var lab = event.oldLabel;
                event.oldLabel = targ.data('label');
            }

            //Handle dirty bit
            setDirty();

            redoStack.push(event);
            tb.enable("redo");

            switch (event.type) {
                case ("addNode"):
                    cy.remove(targ);
                    break;
                case ("addEdge"):
                    cy.remove(targ);
                    break;
                case ("editLabel"):
                    handleWidth(targ, lab);
                    targ.json({ data: {label: lab } });
                    break;
                case ("deleteSelected"):
                    for (var i=0; i<targ.length; i++){
                        targ[i].restore();
                    }
                    break;
            }

        }

        /****************/
        /***** REDO *****/
        /****************/
        var redoStack = new Array();

        function redo() {

            event = redoStack.pop();
            targ = event.target;

            targ.unselect(); // unselect the target before redoing

            // disable the redo button if redoStack is empty
            if (redoStack.length == 0) {
                tb.disable("redo");
            }

            // Get current label for redo before undoing
            if (event.type == "editLabel") {
                var lab = event.oldLabel;
                event.oldLabel = targ.data('label');
            }

            // HANDLE DIRTY BIT
            setDirty();

            // Push to undo stack and enable "undo" button on toolbar
            undoStack.push(event);
            tb.enable("undo");

            switch (event.type) {
                case ("addNode"):
                    cy.add(targ);
                    break;
                case ("addEdge"):
                    cy.add(targ);
                    break;
                case ("editLabel"):
                    handleWidth(targ, lab);
                    targ.json({ data: { label: lab } });
                    break;
                case ("deleteSelected"):
                    for (var i = 0; i < targ.length; i++) {
                        cy.remove(targ[i]);
                    }
                    break;
                case ("moveNode"):
                    break;
            }
        }



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
            lastEvent = { type: "addNode", target: node, time: getTimeStamp() };
            undoStack.push(lastEvent);
            tb.enable("undo"); // enable "undo" button on toolbar

            // EMPTY REDO STACK
            redoStack = [];
            tb.disable("redo"); // disable "redo" button on toolbar

            // HANDLE DIRTY BIT
            setDirty();
        }


        /***** ADD EDGE *****/
        function addEdge(src, dst) {
            //console.log(cy.edges().length);
            //console.log(globalEdgeID);
            incrementEdgeID();
            cy.add({
                group: "edges",
                //data: { id: 50, source: src, target: dst, label: "" }
                data: {id: globalEdgeID, source: src, target: dst, label: ""}
            });
            var edge = cy.getElementById(globalEdgeID);
            //var edge = cy.getElementById(50);

            // UNDO INFO
            lastEvent = { type: "addEdge", target : edge, time: getTimeStamp() };
            undoStack.push(lastEvent);
            tb.enable("undo"); // enable "undo" button on toolbar

            // EMPTY REDO STACK
            redoStack = [];
            tb.disable("redo"); // disable "redo" button on toolbar

            // HANDLE DIRTY BIT
            setDirty();
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
                lastEvent = { type: "editLabel", target: target, oldLabel: oldLabel, time: getTimeStamp() };//, oldLabel: oldLabel };
                undoStack.push(lastEvent);
                tb.enable("undo"); // enable "undo" button on toolbar

                // EMPTY REDO STACK
                redoStack = [];
                tb.disable("redo"); // disable "redo" button on toolbar

                // HANDLE DIRTY BIT
                setDirty();
            }
        }

        /***** DELETE SELECTED *****/
        function deleteSelected() {
            // Get selected nodes and select their connected edges
            var selectedNodes = cy.$('node:selected');
            var connectedEdges = selectedNodes.connectedEdges();
            console.log(connectedEdges);
            connectedEdges.select();

            // Get and remove all selected elements
            var selectedElements = cy.$('node:selected, edge:selected');
            selectedElements.unselect();
            cy.remove(selectedElements);

            // UNDO INFO
            lastEvent = { type: "deleteSelected", target: selectedElements, time: getTimeStamp() };
            undoStack.push(lastEvent);
            tb.enable("undo"); // enable "undo" button on toolbar

            // EMPTY REDO STACK
            redoStack = [];
            tb.disable("redo"); // disable "redo" button on toolbar

            // HANDLE DIRTY BIT
            setDirty();
        }



        /*function saveGraph() {
            var document = {
                title: this.title,
                elements: cy.elements
            };

            documents.saveDocument(document).then(function(data) {
                if (data.data.success === true) {
                    app.successMessage = data.data.message;
                }
                else {
                    app.errorMessage = data.data.message;
                }
            });

            console.log("Document Saved!");
        }*/

    };

}]);

