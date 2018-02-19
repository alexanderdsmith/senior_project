var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var Schema = mongoose.Schema;

var AdminSchema = new Schema({
    username: {
        type: String,
        lowercase: true,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        lowercase: true,
        required: true,
        unique: true
    },
    authList: [{
        userType: {
            type: String,
            lowercase: true,
            required: false
        },
        username: {
            type: String,
            lowercase: true,
            required: true,
            unique: true
        },
        email: {
            type: String,
            required: true,
            lowercase: true,
            unique: true
        }
    }]
});

AdminSchema.pre('save', function(next) {
    var admin = this;

    bcrypt.hash(admin.password, 10, function(err, hash) {
        if(err) return next(err);
        admin.password = hash;
        next();
    });
});

AdminSchema.methods.comparePassword = function() {
    return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('Admin', AdminSchema);