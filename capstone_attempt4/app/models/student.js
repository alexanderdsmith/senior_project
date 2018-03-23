var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var StudentSchema = new Schema({
    name: {
        type: String,
        default: 'username'
    },
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