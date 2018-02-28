var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var SectionSchema = new Schema({
    title: String,
    teachers: [{type: mongoose.Schema.Types.ObjectId, ref: 'Teacher'}],
    students: [{type: mongoose.Schema.Types.ObjectId, ref: 'Student'}],
    assignments: [{type: mongoose.Schema.Types.ObjectId, ref: 'Assignment'}],
    announcements: [{type: mongoose.Schema.Types.ObjectId, ref: 'Announcement'}]
});