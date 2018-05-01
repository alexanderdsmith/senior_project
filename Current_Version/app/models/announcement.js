var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var AnnouncementSchema = new Schema({
    postedBy: String,
    description: String,
    timestamp: Date
});

module.exports = mongoose.model('Announcement', AnnouncementSchema);