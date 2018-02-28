var mongoose = require('mongoose');

var DocumentSchema = new mongoose.Schema({
    title       : {
        type    : String,
        default : 'untitled'
    },
    grade       : Number,
    status      : {
        type    : String,
        default : 'unsubmitted',
        enum    : ['unsubmitted', 'submitted', 'returned']
    },
    submittedTo : {
        type    : mongoose.Schema.Types.ObjectId,
        ref     : 'Assignment'
    },
    _student    : {
        type    : mongoose.Schema.Types.ObjectId,
        ref     : 'Student'
    },
    graph       : {
        elements  : [String],
        undoStack : [String]
    }
});

DocumentSchema.methods.updateGraph = function(data, cb) {
    this.graph.elements = data.elements;
    this.graph.undoStack = data.undoStack;
    this.save(cb);
};

DocumentSchema.methods.updateStatus = function(status, cb) {
    this.status = status;
    this.save(cb);
};

DocumentSchema.methods.updateSubmittedTo = function(assignmentId, cb) {
    this.submittedTo = assignmentId;
    this.save(cb);
};

DocumentSchema.methods.updateTitle = function(title, cb) {
    this.title = title;
    this.save(cb);
};

DocumentSchema.methods.updateGrade = function(grade, cb) {
    this.grade = grade;
    this.save(cb);
};

mongoose.model('Document', DocumentSchema);