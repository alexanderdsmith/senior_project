var extendSchema = require('mongoose-extend-schema');
var mongoose = require('mongoose');
var AbstractUser = require('./abstract_user.js');

var AdminSchema = extendSchema(AbstractUser, {});

module.exports = mongoose.model('Admin', AdminSchema);