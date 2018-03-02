var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;
var extendSchema = require('mongoose-extend-schema');
var AbstractUser = require('./abstract_user');

var StudentSchema = extendSchema(AbstractUser, {
    _courses  : [{
        type : Schema.Types.ObjectId,
        ref  : 'Course'
    }],
    _documents : [{
        type : Schema.Types.ObjectId,
        ref  : 'Document'
    }]
});

module.exports = mongoose.model('Student', StudentSchema);