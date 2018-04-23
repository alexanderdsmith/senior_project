var mongoose     = require('mongoose');
var User         = require('./abstract_user');
var Schema       = mongoose.Schema;
var extend       = require('mongoose-extend-schema');

var TaSchema = extend(User, {
    _courses : [{
        type : Schema.Types.ObjectId,
        ref  : 'Course'
    }]
});

module.exports = mongoose.model('Ta', TaSchema);
