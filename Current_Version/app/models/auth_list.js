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

// TODO: Fix uploading a second course containing student profiles
AuthListSchema.methods.updateList = function(list_additions, course_id) {
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
                        if(thistype === 'admin') {
                            var admin = new Admin();
                            admin.save();
                            user._admin = admin;
                            user.usertypes.push('admin');
                            user.save(function (err) {
                                if (err) {
                                    console.log('could not save user!');
                                } else {
                                    console.log('user successfully updated!');
                                }
                            });
                        } else {
                            Course.findById(course_id).exec(function (err, course) {
                                console.log(course);
                                if (err) throw err;
                                if (course) {
                                    switch (thistype) {
                                        case 'student': {
                                            var student = new Student({
                                                _courses: [],
                                                _documents: []
                                            });
                                            student._courses.push(course);
                                            student.save();
                                            course._students.push(student);
                                            course.save();
                                            user._student = student;
                                            user.usertypes.push('student');
                                            user.save(function (err) {
                                                if (err) {
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
                                            ta._courses.push(course);
                                            ta.save();
                                            course._tas.push(ta);
                                            course.save();
                                            user._ta = ta;
                                            user.usertypes.push('ta');
                                            user.save(function (err) {
                                                if (err) {
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
                                            teacher._courses.push(course);
                                            teacher.save();
                                            course._teachers.push(teacher);
                                            course.save();
                                            user._teacher = teacher;
                                            user.usertypes.push('teacher');
                                            user.save(function (err) {
                                                if (err) {
                                                    console.log('could not save user!');
                                                } else {
                                                    console.log('user successfully updated!');
                                                }
                                            });
                                            break;
                                        }
                                    }
                                } else {
                                    console.log('error! course not found!');
                                }
                            });
                        }
                        // else, create a new user...
                    } else {
                        var newUser = new AbstractUser({
                            username: list_additions[index],
                            email: list_additions[index] + '@slu.edu',
                            usertypes: []
                        });
                        if(thistype === 'admin') {
                            var admin = new Admin();
                            admin.save();
                            newUser._admin = admin;
                            newUser.usertypes.push('admin');
                            newUser.save(function (err) {
                                if (err) {
                                    console.log(err);
                                    console.log('could not save user!');
                                } else {
                                    console.log('user successfully updated!');
                                }
                            });
                        } else {
                            Course.findById(course_id).exec(function (err, course) {
                                if (err) throw err;
                                if (course) {
                                    switch (thistype) {
                                        case 'student': {
                                            var student = new Student({
                                                _courses: [],
                                                _documents: []
                                            });
                                            console.log('populating new!');
                                            student._courses.push(course);
                                            student.save();
                                            course._students.push(student);
                                            course.save();
                                            newUser._student = student;
                                            newUser.usertypes.push('student');
                                            newUser.save(function (err) {
                                                if (err) {
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
                                            ta._courses.push(course);
                                            ta.save();
                                            course._tas.push(ta);
                                            course.save();
                                            newUser._ta = ta;
                                            newUser.usertypes.push('ta');
                                            newUser.save(function (err) {
                                                if (err) {
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
                                            teacher._courses.push(course);
                                            teacher.save();
                                            course._teachers.push(teacher);
                                            course.save();
                                            newUser._teacher = teacher;
                                            newUser.usertypes.push('teacher');
                                            newUser.save(function (err) {
                                                if (err) {
                                                    console.log('could not save user!');
                                                } else {
                                                    console.log('user successfully created!');
                                                }
                                            });
                                            break;
                                        }
                                    }
                                } else {
                                    console.log('error! course not found!');
                                }
                            });
                        }
                    }
                });
            })(i);
        }
    }
    this.save();
};

module.exports = mongoose.model('AuthList', AuthListSchema);