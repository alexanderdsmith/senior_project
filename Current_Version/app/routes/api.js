var AbstractUser = require('../models/abstract_user');
var Admin        = require('../models/admin');
var Assignment   = require('../models/assignment');
var AuthList     = require('../models/auth_list');
var Course       = require('../models/course');
var Document     = require('../models/document');
var Student      = require('../models/student');
var Ta           = require('../models/ta');
var Teacher      = require('../models/teacher');
var jwt          = require('jsonwebtoken');
var mongoose     = require('mongoose');
var Papa         = require('papaparse');
mongoose.Promise = require('bluebird');

module.exports = function(router, keys) {

    /***************************/
    /**** USER REGISTRATION ****/
    /***************************/
    router.post('/users', function(req, res) {
        var user = new AbstractUser();
        user.username = req.body.username;
        user.password = req.body.password;
        user.email    = req.body.email;
        if(req.body.username === null || req.body.username === '' || req.body.password === null || req.body.password === '' || req.body.email === null || req.body.email === '') {
            res.json({ success: false, message: 'Ensure username, password, and email are provided' });
        } else {
            AuthList.findOne({ usertype: 'admin' }).exec(function(err, list) {
                if(err) throw err;
                if(list.authorized.indexOf(user.username) !== -1) {
                    user.usertypes = ['admin'];
                    var admin = new Admin();
                    admin.save();
                    user._admin = admin;
                }
            });
            user.save(function(err) {
                console.log(user);
                if(err) {
                    res.json({ success: false, message: 'Username or Email already exists!' });
                } else {
                    res.json({ success: true, message: 'Account successfully created!' });
                }
            });
        }
    });

    /***************************/
    /**** AUTHENTICATE USER ****/
    /** UPDATES USER ON LOGIN **/
    /***************************/
    router.post('/authenticate', function(req, res) {
        AbstractUser.findOne({ username: req.body.username }).exec(function(err, user) {
            if(err) throw err;
            if(!user) {
                res.json({ success: false, message: 'Could not find user!' });
            } else if(user) {
                if (req.body.password) {
                    var validPassword = user.comparePassword(req.body.password);
                    if (!validPassword) {
                        res.json({success: false, message: 'Incorrect password!'});
                    } else {
                        var token = jwt.sign({
                            username  : user.username,
                            email     : user.email,
                            usertypes : user.usertypes
                        }, keys.encryption.secret, { expiresIn: keys.encryption.expiration });

                        // TODO: when user is authenticated, begin user updates!
                        if((user.usertypes.indexOf('student') !== -1) && user._student === null) {
                            user._student = new Student({
                                _courses: [],
                                _documents: []
                            });
                        }

                        res.json({success: true, message: 'User authenticated', token: token });
                    }
                } else {
                    res.json({success: false, message: 'No password provided.'});
                }
            }
        })
    });

    /***************************/
    /***** ROUTER METHODS ******/
    /***************************/
    router.use(function(req, res, next) {
        var token = req.body.token || req.body.query || req.headers['x-access-token'];

        if(token) {
            jwt.verify(token, keys.encryption.secret, function(error, decoded) {
                if(error) {
                    res.json({ success: false, message: 'Token invalid' });
                } else {
                    req.decoded = decoded;
                    next();
                }
            })
        } else if(!token) {
            res.json({success: false, message: 'No token provided'});
        }
    });

    /***************************/
    /****** CURRENT  USER ******/
    /***************************/
    router.post('/currUser', function(req, res) {
        res.send(req.decoded);
    });

    /***************************/
    /*** CSV AUTHLIST UPLOAD ***/
    /***************************/
    router.post('/uploadCourse', function(req, res) {
        console.log(req.body.title);
        if(req.body.csv !== null && req.body.csv !== '' && typeof(req.body.csv) !== 'undefined' && 0 === 1) {
            var csv = Papa.parse(req.body.data.csv, {
                delimiter: ',',
                header: true
            });
            if (!req.body.title)
            var course = new Course({title: req.body.data.title});

            var adminlist   = [];
            var studentlist = [];
            var talist      = [];
            var teacherlist = [];

            /** build authorized users lists **/
            for(var i = 0; i < csv.data.length; i++) {
                switch(csv.data[i].Type) {
                    case 'admin': {
                        adminlist.push(csv.data[i].Username);
                        break;
                    }
                    case 'student' || '' || null: {
                        studentlist.push(csv.data[i].Username);
                        break;
                    }
                    case 'ta' : {
                        talist.push(csv.data[i].Username);
                        break;
                    }
                    case 'teacher' : {
                        teacherlist.push(csv.data[i].Username);
                        break;
                    }
                    default: {
                        console.log(csv.data[i].Username + ' was unable to be authenticated!');
                    }
                }
            }

            AuthList.findOne({ usertype: 'admin' }).exec(function (err, list) {
                if (err) throw err;
                if(list) {
                    list.updateList(adminlist, course);
                } else {
                    res.json({ success: false, message: 'CSV file is not correctly formatted!' });
                }
            });

            AuthList.findOne({ usertype: 'student' }).exec(function (err, list) {
                if (err) throw err;
                if(list) {
                    list.updateList(studentlist, course);
                } else {
                    res.json({ success: false, message: 'CSV file is not correctly formatted!' });
                }
            });

            AuthList.findOne({ usertype: 'ta' }).exec(function (err, list) {
                if (err) throw err;
                if(list) {
                    list.updateList(talist, course);
                } else {
                    res.json({ success: false, message: 'CSV file is not correctly formatted!' });
                }
            });

            AuthList.findOne({ usertype: 'teacher' }).exec(function (err, list) {
                if (err) throw err;
                if(list) {
                    list.updateList(teacherlist, course);
                } else {
                    res.json({ success: false, message: 'CSV file is not correctly formatted!' });
                }
            });

            res.json({ success: true, message: 'CSV file successfully uploaded!' });

        } else {
            res.json({ success: false, message: 'Please select a CSV File!' });
        }
    });

    router.post('/addAssignment', function(req, res) {
        var assignment = new Assignment();
        assignment.title = req.body.title;
        assignment.description = req.body.description;
        assignment.dueDate = 'Today';
        res.send(assignment);
    });

    /****************************/
    /* ON ROUTE CHANGE & RELOAD */
    /****** UPDATE PROFILE ******/
    /***** 'JSONIFIES' DATA *****/
    /****************************/

    // TODO: FINISH POPULATION TREE & UPDATE REQUESTS
    router.get('/profileData', function(req, res) {

        /** SEND PAYLOAD (Structure for payload) **/
        var profile_payload = {
            user: {
                username: req.decoded.username,
                email: req.decoded.email,
                usertypes: req.decoded.usertypes
            },
            admin_profile: {
                id: mongoose.Schema.ObjectId
            },
            student_profile: {
                id: mongoose.Schema.ObjectId,
                course_list: [{
                    id: mongoose.Schema.ObjectId,
                    title: String
                }],
                documents_list: [{
                    id: mongoose.Schema.ObjectId,
                    title: String
                }]
            },
            ta_profile: {
                id: mongoose.Schema.ObjectId,
                course_list: [{
                    id: mongoose.Schema.ObjectId,
                    title: String
                }]
            },
            teacher_profile: {
                course_list: [{
                    id: mongoose.Schema.ObjectId,
                    title: String
                }]
            }
        };

        /** UPDATE USERS BEFORE PAYLOAD **/
        AbstractUser.findOne({ username: req.decoded.username }).populate({
            path: '_admin'
        }).populate({
            path: '_student',
            populate: [{
                path: '_courses',
                populate: [{
                    path: '_teachers'
                }, {
                    path: '_assignments'
                }, {
                    path: '_announcements'
                }]
            }, {
                path: '_documents'
            }]
        }).populate({
            path: '_ta',
            populate: {
                path: '_courses'
            }
        }).populate({
            path: '_teacher',
            populate: { path: '_courses' }
        }).exec(function(err, user) {
            if(err) throw err;
            if((user.usertypes.indexOf('admin') !== -1 ) && (user._admin === null)) {
                var admin = new Admin();
                admin.save();
                user._admin = admin;
                user.usertypes.push('admin');
                user.save();
            }
            if((user.usertypes.indexOf('student') !== -1) && (user._student === null)) {
                var student = new Student({
                    _courses: [],
                    _documents: []
                });
                student.save();
                user._student = student;
                user.usertypes.push('student');
                user.save();
            }
            if((user.usertypes.indexOf('ta') !== -1) && (user._ta === null)) {
                var ta = new Ta({
                    _courses: []
                });
                ta.save();
                user._ta = ta;
                user.usertypes.push('ta');
                user.save();
            }
            if((user.usertypes.indexOf('teacher') !== -1) && (user._teacher === null)) {
                var teacher = new Teacher({
                    _courses: []
                });
                teacher.save();
                user._teacher = teacher;
                user.usertypes.push('teacher');
                user.save();
            }
        });

        /** BUILD PAYLOAD **/
        AbstractUser.findOne({
            username: req.decoded.username
        }).populate({
            path: '_admin'
        }).populate({
            path: '_student',
            populate: [{ path: '_courses' }, { path: '_documents' }]
        }).populate({
            path: '_ta',
            populate: { path: '_courses' }
        }).populate({
            path: '_teacher',
            populate: { path: '_courses' }
        }).exec(function(err, user) {
            if(err) throw err;
            if(user) {
                console.log(user);
                profile_payload.user.username = user.username;
                profile_payload.user.name = user.givenname;
                profile_payload.user.email = user.email;

                profile_payload.admin_profile.id = user._admin._id;

                profile_payload.student_profile.id = user._student._id;
                user._student._courses.forEach(function(course) {
                    profile_payload.student_profile.course_list.append({
                        id: course._id,
                        title: course.title
                    });
                });
                user._student._documents.forEach(function(document) {
                    profile_payload.student_profile.documents_list.append({
                        id: document._id,
                        title: document.title
                    })
                });

                profile_payload.ta_profile.id = user._ta._id;
                user._ta._courses.forEach(function(course) {
                    profile_payload.ta_profile.course_list.append({
                        id: course._id,
                        title: course.title
                    });
                });

                profile_payload.teacher_profile.id = user._teacher._id;
                user._teacher._courses.forEach(function(course) {
                    profile_payload.teacher_profile.course_list.append({
                        id: course._id,
                        title: course.title
                    });
                });
            }
        });

        res.send(profile_payload);
    });

    return router;
};