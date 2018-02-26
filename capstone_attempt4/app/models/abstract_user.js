var mongoose = require('mongoose');
var bcrypt   = require('bcrypt');
var Schema   = mongoose.Schema;

var AbstractUserSchema = new Schema({
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

AbstractUserSchema.methods.comparePassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('AbstractUser', AbstractUserSchema);