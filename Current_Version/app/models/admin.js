var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;
var extend       = require('mongoose-extend-schema');
var User         = require('./abstract_user');

var AdminSchema = extend(User, {});

module.exports = mongoose.model('Admin', AdminSchema);
