var mongoose = require('mongoose');
var bcrypt   = require('bcrypt');
var Schema   = mongoose.Schema;

var AbstractUserSchema = new Schema({

    // TODO: make givenname required!
    givenname : {
        type      : String,
        lowercase : true
    },
    username  : {
        type      : String,
        lowercase : true,
        required  : true,
        unique    : true
    },
    password  : {
        type     : String
        // required : true
    },
    email     : {
        type      : String,
        required  : true,
        lowercase : true,
        unique    : true
    },
    usertypes : [{
        type: String,
        enum: ['admin', 'student', 'ta', 'instructor']
    }],
    _admin    : {
        type : Schema.Types.ObjectId,
        ref  : 'Admin'
    },
    _student  : {
        type : Schema.Types.ObjectId,
        ref  : 'Student'
    },
    _ta       : {
        type : Schema.Types.ObjectId,
        ref  : 'Ta'
    },
    _instructor : {
        type : Schema.Types.ObjectId,
        ref  : 'Instructor'
    }
});

/*AbstractUserSchema.pre('save', function(next) {
    if(this.isNew) {
        var user = this;
        bcrypt.hash(user.password, 10, function (err, hash) {
            if(err) return next(err);
            user.password = hash;
            next();
        });
    } else {
        next();
    }
});*/

AbstractUserSchema.methods.comparePassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('AbstractUser', AbstractUserSchema);