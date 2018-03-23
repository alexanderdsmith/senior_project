var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var AdminSchema = new Schema({});

module.exports = mongoose.model('Admin', AdminSchema);
