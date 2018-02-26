var mongoose = require('mongoose');
var extendSchema = require('mongoose-extend-schema');
var AbstractUser = require('./abstract_user');
var bcrypt = require('bcrypt');

var StudentSchema = extendSchema(AbstractUser);

StudentSchema.pre('save', function(next) {
    var student = this;

    bcrypt.hash(student.password, 10, function(err, hash) {
        if(err) return next(err);
        student.password = hash;
        next();
    });
});

module.exports = mongoose.model('Student', StudentSchema);