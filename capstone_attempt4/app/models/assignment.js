var mongoose = require('mongoose');

var AssignmentSchema = new mongoose.Schema({
    title: String,
    description: String,
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

// Assignment.updateTitle(title, cb);
AssignmentSchema.methods.updateTitle = function(title, cb) {
    this.title = title;
    this.save(cb);
};

AssignmentSchema.methods.updateDescription = function(description, cb) {
    this.description = description;
    this.save(cb);
};

mongoose.model('Assignment', AssignmentSchema);