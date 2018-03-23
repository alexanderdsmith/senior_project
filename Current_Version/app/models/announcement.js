var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var AnnouncementSchema = new Schema({
    title: String,
    description: String,
    timestamp: Date,
    _teacher: {
        type: Schema.Types.ObjectId,
        ref: 'Teacher'
    },
    _ta: {
        type: Schema.Types.ObjectId,
        ref: 'Ta'
    },
    _course: {
        type: Schema.Types.ObjectId,
        ref: 'Course'
    }
});

module.exports = mongoose.model('Announcement', AnnouncementSchema);