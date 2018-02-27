var mongoose = require('mongoose');
var extendSchema = require('mongoose-extend-schema');
var AbstractUser = require('./abstract_user');

var StudentSchema = extendSchema(AbstractUser, {});

module.exports = mongoose.model('Student', StudentSchema);