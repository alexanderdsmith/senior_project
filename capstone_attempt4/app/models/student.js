var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;
var extendSchema = require('mongoose-extend-schema');
var AbstractUser = require('./abstract_user');

var StudentSchema = extendSchema(AbstractUser, {
    _documents : [{
        type : Schema.Types.ObjectId,
        ref  : 'Document'
    }],
    _sections  : [{
        type : Schema.Types.ObjectId,
        ref  : 'Section'
    }]
});

module.exports = mongoose.model('Student', StudentSchema);