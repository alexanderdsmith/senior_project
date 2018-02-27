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
    },
    _admin   : {
        type : Schema.Types.ObjectId,
        ref  : 'Admin'
    },
    _student : {
        type : Schema.Types.ObjectId,
        ref  : 'Student'
    },
    _teacher : {
        type : Schema.Types.ObjectId,
        ref  : 'Teacher'
    }
});

AbstractUserSchema.methods.comparePassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('AbstractUser', AbstractUserSchema);