var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var Schema = mongoose.Schema;

var TeacherSchema = new Schema({
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
        required: true,
        lowercase: true,
        unique: true
    }
});

TeacherSchema.pre('save', function(next) {
    var teacher = this;

    bcrypt.hash(teacher.password, 10, function(err, hash) {
        if(err) return next(err);
        teacher.password = hash;
        next();
    });
});

TeacherSchema.methods.comparePassword = function() {
    return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('Teacher', TeacherSchema);