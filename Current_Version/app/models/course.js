var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var CourseSchema = new Schema({
    title: String,
    _students: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student'
    }],
    _tas: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Ta'
    }],
    _instructors: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Instructor'
    }],
    _assignments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Assignment'
    }],
    _announcements: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Announcement'
    }]
});

module.exports = mongoose.model('Course', CourseSchema);
