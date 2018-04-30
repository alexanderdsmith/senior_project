var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var AdminSchema = new Schema({
    username: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Admin', AdminSchema);
