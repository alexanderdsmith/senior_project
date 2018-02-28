var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;
var extendSchema = require('mongoose-extend-schema');
var AbstractUser = require('./abstract_user');

var TeacherSchema = extendSchema(AbstractUser, {
    _sections : [{
        type : Schema.Types.ObjectId,
        ref  : 'Section'
    }]
});

module.exports = mongoose.model('Teacher', TeacherSchema);