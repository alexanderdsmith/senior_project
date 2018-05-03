var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var DocumentSchema = new Schema({
    timestamp: Date,
    grade: {
        type: Number,
        default: -1
    },
    feedback: String,
    submitTime: Date,
    status: {
        type    : String,
        default : 'unsubmitted',
        enum    : ['unsubmitted', 'submitted', 'graded']
    },
    graph: {
        elements  : [String],
        undoStack : [String]
    }
});

/****************************/
/***** Old Docs Methods *****/
/****************************/
DocumentSchema.methods.updateTitle = function(title) {
    this.title = title;
    this.save();
};

DocumentSchema.methods.updateGrade = function(grade) {
    this.grade = grade;
    this.save();
};

module.exports = mongoose.model('Document', DocumentSchema);
