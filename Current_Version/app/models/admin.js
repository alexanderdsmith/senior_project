var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var AdminSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    givenname: {
        type: String
    }
});

module.exports = mongoose.model('Admin', AdminSchema);
