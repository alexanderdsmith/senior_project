var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var CourseSchema = new Schema({
    title: String,
    _students: [{
        type: Schema.Types.ObjectId,
        ref: 'Student'
    }],
    _tas: [{
        type: Schema.Types.ObjectId,
        ref: 'Ta'
    }],
    _instructors: [{
        type: Schema.Types.ObjectId,
        ref: 'Instructor'
    }],
    _assignments: [{
        type: Schema.Types.ObjectId,
        ref: 'Assignment'
    }],
    _announcements: [{
        type: Schema.Types.ObjectId,
        ref: 'Announcement'
    }]
});

module.exports = mongoose.model('Course', CourseSchema);
