var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var AnnouncementSchema = new Schema({
    title: String,
    description: String,
    timestamp: Date,
    _instructor: {
        type: Schema.Types.ObjectId,
        ref: 'Instructor'
    },
    _ta: {
        type: Schema.Types.ObjectId,
        ref: 'Ta'
    }
});

module.exports = mongoose.model('Announcement', AnnouncementSchema);