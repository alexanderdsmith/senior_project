var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var AnnouncementSchema = new Schema({
    title: String,
    date: new Date(),
    text: String,
    _teacher: {
        type: Schema.Types.ObjectId,
        ref: 'Teacher'
    }
});

module.exports = mongoose.model('Announcement', AnnouncementSchema);