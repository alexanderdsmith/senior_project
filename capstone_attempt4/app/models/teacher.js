var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var TeacherSchema = new Schema({
    _courses : [{
        type : Schema.Types.ObjectId,
        ref  : 'Course'
    }]
});

module.exports = mongoose.model('Teacher', TeacherSchema);
