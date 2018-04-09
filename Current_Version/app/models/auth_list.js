var mongoose     = require('mongoose');
var AbstractUser = require('./abstract_user');
var Admin        = require('./admin');
var Course       = require('./course');
var Student      = require('./student');
var Ta           = require('./ta');
var Teacher      = require('./teacher');
var Schema       = mongoose.Schema;

var AuthListSchema = new Schema({
    authorized : [{ type: String }],
    usertype   : {
        type      : String,
        required  : true,
        lowercase : true,
        unique    : true,
        // can add new types
        enum      : ['admin', 'student', 'ta', 'teacher']
    }
});

// AuthList.createList(list); will initialize the list (will run once per server)
AuthListSchema.methods.createList = function(list) {
    for(var i = 0; i < list.length; i++) {
        this.authorized.push(list[i]);
    }
    this.save();
};

// ensures users are not double authenticated!
// AuthList.updateList(list_additions); will update the authenticated users list
AuthListSchema.methods.updateList = function(list_additions) {
    // Admin list updates on restart
    var thistype = this.usertype;

    for(var i = 0; i < list_additions.length; i++) {
        if (this.authorized.indexOf(list_additions[i]) === -1) {
            this.authorized.push(list_additions[i]);
            (function(index) {
                AbstractUser.findOne({ username: list_additions[i] }).exec(function(err, user) {
                    if(err) throw err;
                    // if user exists, update
                    if(user) {
                        switch(thistype) {
                            case 'admin': {
                                var admin = new Admin();
                                admin.save();
                                user._admin = admin;
                                user.usertypes.push('admin');
                                user.save(function(err) {
                                    if(err) {
                                        console.log('could not save user!');
                                    } else {
                                        console.log('user successfully updated!');
                                    }
                                });
                                break;
                            }
                            case 'student': {
                                var student = new Student({
                                    _courses: [],
                                    _documents: []
                                });
                                student.save();
                                user._student = student;
                                user.usertypes.push('student');
                                user.save(function(err) {
                                    if(err) {
                                        console.log('could not save user!');
                                    } else {
                                        console.log('user successfully updated!');
                                    }
                                });
                                break;
                            }
                            case 'ta': {
                                var ta = new Ta({
                                    _courses: []
                                });
                                ta.save();
                                user._ta = ta;
                                user.usertypes.push('ta');
                                user.save(function(err) {
                                    if(err) {
                                        console.log('could not save user!');
                                    } else {
                                        console.log('user successfully updated!');
                                    }
                                });
                                break;
                            }
                            case 'teacher': {
                                var teacher = new Teacher({
                                    _courses: []
                                });
                                teacher.save();
                                user._teacher = teacher;
                                user.usertypes.push('teacher');
                                user.save(function(err) {
                                    if(err) {
                                        console.log('could not save user!');
                                    } else {
                                        console.log('user successfully updated!');
                                    }
                                });
                                break;
                            }
                        }
                        // else, create a new user...
                    } else {
                        var newUser = new AbstractUser({
                            username: list_additions[index],
                            email: list_additions[index] + '@slu.edu',
                            usertypes: []
                        });
                        switch(thistype) {
                            case 'admin': {
                                var admin = new Admin();
                                admin.save();
                                newUser._admin = admin;
                                newUser.usertypes.push('admin');
                                newUser.save(function(err) {
                                    if(err) {
                                        console.log(err);
                                        console.log('could not save user!');
                                    } else {
                                        console.log('user successfully updated!');
                                    }
                                });
                                break;
                            }
                            case 'student': {
                                var student = new Student({
                                    _courses: [],
                                    _documents: []
                                });
                                student.save();
                                newUser._student = student;
                                newUser.usertypes.push('student');
                                newUser.save(function(err) {
                                    if(err) {
                                        console.log('could not save user!');
                                    } else {
                                        console.log('user successfully created!');
                                    }
                                });
                                break;
                            }
                            case 'ta': {
                                var ta = new Ta({
                                    _courses: []
                                });
                                ta.save();
                                newUser._ta = ta;
                                newUser.usertypes.push('ta');
                                newUser.save(function(err) {
                                    if(err) {
                                        console.log('could not save user!');
                                    } else {
                                        console.log('user successfully created!');
                                    }
                                });
                                break;
                            }
                            case 'teacher': {
                                var teacher = new Teacher({
                                    _courses: []
                                });
                                teacher.save();
                                newUser._teacher = teacher;
                                newUser.usertypes.push('teacher');
                                newUser.save(function(err) {
                                    if(err) {
                                        console.log('could not save user!');
                                    } else {
                                        console.log('user successfully created!');
                                    }
                                });
                                break;
                            }
                        }
                    }
                });
            })(i);
        }
    }
    this.save();
};

module.exports = mongoose.model('AuthList', AuthListSchema);