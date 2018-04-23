var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;
var extend       = require('mongoose-extend-schema');
var User         = require('./abstract_user');

var StudentSchema = new Schema({
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