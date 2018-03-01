var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;
var extendSchema = require('mongoose-extend-schema');
var AbstractUser = require('./abstract_user');

var TaSchema = extendSchema(AbstractUser, {});

module.exports = mongoose.model('Ta', TaSchema);