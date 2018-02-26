var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var Schema = mongoose.Schema;

var StudentSchema = new Schema({
    username : {
        type      : String,
        lowercase : true,
        required  : true,
        unique    : true
    },
    password : {
        type      : String,
        required  : true
    },
    email    : {
        type      : String,
        required  : true,
        lowercase : true,
        unique    : true
    }
});

StudentSchema.pre('save', function(next) {
    var student = this;

    bcrypt.hash(student.password, 10, function(err, hash) {
        if(err) return next(err);
        student.password = hash;
        next();
    });
});

StudentSchema.methods.comparePassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('Student', StudentSchema);