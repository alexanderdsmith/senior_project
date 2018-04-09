var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var AssignmentSchema = new Schema({
    title: String,
    description: String,
    dueDate : {
        type: String,
        required: true
    },
    timestamp: String,
    _teachers: [{
        type: Schema.Types.ObjectId,
        ref: 'Teacher'
    }],
    _course: {
        type: Schema.Types.ObjectId,
        ref: 'Course'
    },
    _submissions: [{
        type: Schema.Types.ObjectId,
        ref: 'Document'
    }]
});

/****************************/
/***** Old Assn Methods *****/
/****************************/
AssignmentSchema.methods.updateTitle = function(title) {
    this.title = title;
    this.save();
};

AssignmentSchema.methods.updateDescription = function(description) {
    this.description = description;
    this.save();
};

module.exports = mongoose.model('Assignment', AssignmentSchema);