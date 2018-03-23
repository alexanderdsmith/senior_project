var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var CourseSchema = new Schema({
    title: String,
    _teachers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Teacher'
    }],
    _students: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student'
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
