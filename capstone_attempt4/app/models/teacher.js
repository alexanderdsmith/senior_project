var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;
var extendSchema = require('mongoose-extend-schema');
var AbstractUser = require('./abstract_user');

var TeacherSchema = extendSchema(AbstractUser, {
    _courses : [{
        type : Schema.Types.ObjectId,
        ref  : 'Course'
    }]
});

module.exports = mongoose.model('Teacher', TeacherSchema);
