var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var CourseSchema = new Schema({
    title: String,
    teachers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Teacher'
    }],
    students: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student'
    }],
    tas: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Ta'
    }],
    assignments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Assignment'
    }],
    announcements: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Announcement'
    }]
});

module.exports = mongoose.model('Course', CourseSchema);
