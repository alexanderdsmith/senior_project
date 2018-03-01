var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var AssignmentSchema = new Schema({
    title: String,
    description: String,
    dueDate : {
        type: Date,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    teachers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Teacher'
    }],
    section: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Section'
    },
    submissions: [{
        type: mongoose.Schema.Types.ObjectId,
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

mongoose.model('Assignment', AssignmentSchema);
