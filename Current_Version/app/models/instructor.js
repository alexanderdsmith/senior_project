var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var InstructorSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    givenname: {
        type: String
    },
    _courses : [{
        type : Schema.Types.ObjectId,
        ref  : 'Course'
    }]
});

module.exports = mongoose.model('Instructor', InstructorSchema);
