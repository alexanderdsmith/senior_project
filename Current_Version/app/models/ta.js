var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var TaSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    _courses : [{
        type : Schema.Types.ObjectId,
        ref  : 'Course'
    }]
});

module.exports = mongoose.model('Ta', TaSchema);
