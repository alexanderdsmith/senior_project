var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var DocumentSchema = new Schema({
    timestamp   : {
        type : Date
    },
    grade       : {
        type : Number,
        default : -1
    },
    status      : {
        type    : String,
        default : 'unsubmitted',
        enum    : ['unsubmitted', 'submitted', 'returned']
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

module.exports = mongoose.model('Document', DocumentSchema);
