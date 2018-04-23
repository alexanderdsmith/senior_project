var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;
var extend       = require('mongoose-extend-schema');
var User         = require('./abstract_user');

var TeacherSchema = extend(User, {
    _courses : [{
        type : Schema.Types.ObjectId,
        ref  : 'Course'
    }]
});

module.exports = mongoose.model('Teacher', TeacherSchema);
