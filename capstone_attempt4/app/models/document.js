var mongoose = require('mongoose');

var DocumentSchema = new mongoose.Schema({
    title       : {
        type    : String,
        default : 'untitled'
    },
    timestamp   : {
        type : Date,
        default : Date.now
    },
    grade       : Number,
    status      : {
        type    : String,
        default : 'unsubmitted',
        enum    : ['unsubmitted', 'submitted', 'returned']
    },
    submittedTo : {
        type : mongoose.Schema.Types.ObjectId,
        ref  : 'Assignment'
    },
    _student    : {
        type : mongoose.Schema.Types.ObjectId,
        ref  : 'Student'
    },
    graph       : {
        elements  : [String],
        undoStack : [String]
    }
});

/****************************/
/***** Old Docs Methods *****/
/****************************/
DocumentSchema.methods.updateGraph = function(data) {
    this.graph.elements = data.elements;
    this.graph.undoStack = data.undoStack;
    this.save();
};

DocumentSchema.methods.updateStatus = function(status) {
    this.status = status;
    this.save();
};

DocumentSchema.methods.updateSubmittedTo = function(assignmentId) {
    this.submittedTo = assignmentId;
    this.save();
};

DocumentSchema.methods.updateTitle = function(title) {
    this.title = title;
    this.save();
};

DocumentSchema.methods.updateGrade = function(grade) {
    this.grade = grade;
    this.save();
};

mongoose.model('Document', DocumentSchema);
