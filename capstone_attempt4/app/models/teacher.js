var mongoose = require('mongoose');
var extendSchema = require('mongoose-extend-schema');
var AbstractUser = require('./abstract_user');

var TeacherSchema = extendSchema(AbstractUser, {});

module.exports = mongoose.model('Teacher', TeacherSchema);