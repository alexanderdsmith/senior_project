var extendSchema = require('mongoose-extend-schema');
var mongoose = require('mongoose');
var AbstractUser = require('./abstract_user.js');
var bcrypt = require('bcrypt');

var AdminSchema = extendSchema(AbstractUser);

AdminSchema.pre('save', function(next) {
    var admin = this;

    bcrypt.hash(admin.password, 10, function(err, hash) {
        if(err) return next(err);
        admin.password = hash;
        next();
    });
});

module.exports = mongoose.model('Admin', AdminSchema);