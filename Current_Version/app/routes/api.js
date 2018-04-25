var AbstractUser = require('../models/abstract_user');
var Admin        = require('../models/admin');
var Assignment   = require('../models/assignment');
var Announcement = require('../models/announcement');
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
    // TODO: Cleanup & Remove this function, as it is unused.
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
                            givenname : user.givenname,
                            username  : user.username,
                            email     : user.email,
                            usertypes : user.usertypes
                        }, keys.encryption.secret, { expiresIn: keys.encryption.expiration });

                        // TODO: when user is authenticated, begin user updates!

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

    // TODO: Fix this so that users can be updated when they already exist! (this is a course upload, not a user auth list!)
    router.post('/uploadCourse', function(req, res) {
        if(req.body.csv !== null && req.body.csv !== '' && typeof(req.body.csv) !== 'undefined') {
            var csv = Papa.parse(req.body.csv, {
                delimiter: ',',
                header: true
            });
            var course = new Course({
                title: req.body.title,
                _students: [],
                _tas: [],
                _teachers: [],
                _announcements: [],
                _assignments: []
            });
            course.save();

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
                        console.log(csv.data[i].Username + ' was not correctly formatted!\n' + csv.data[i].Type + ' is not a valid type.');
                    }
                }
            }

            AuthList.findOne({ usertype: 'admin' }).exec(function (err, list) {
                if (err) throw err;
                if(list) {
                    list.updateList(adminlist, course._id);
                } else {
                    res.json({ success: false, message: 'CSV file is not correctly formatted!' });
                }
            });

            AuthList.findOne({ usertype: 'student' }).exec(function (err, list) {
                if (err) throw err;
                if(list) {
                    list.updateList(studentlist, course._id);
                } else {
                    res.json({ success: false, message: 'CSV file is not correctly formatted!' });
                }
            });

            AuthList.findOne({ usertype: 'ta' }).exec(function (err, list) {
                if (err) throw err;
                if(list) {
                    list.updateList(talist, course._id);
                } else {
                    res.json({ success: false, message: 'CSV file is not correctly formatted!' });
                }
            });

            AuthList.findOne({ usertype: 'teacher' }).exec(function (err, list) {
                if (err) throw err;
                if(list) {
                    list.updateList(teacherlist, course._id);
                } else {
                    res.json({ success: false, message: 'CSV file is not correctly formatted!' });
                }
            });

            res.json({ success: true, message: 'CSV file successfully uploaded!' });

        } else {
            res.json({ success: false, message: 'Please select a CSV File!' });
        }
    });

    router.post('/addAnnouncement', function(req, res) {
        console.log(req.body);
        var announcement = new Announcement();
        announcement.title = req.body.title;
        announcement.description = req.body.description;
        announcement.timestamp = Date.now();
        announcement.postedBy = req.body.postedBy;

    });

    router.post('/addAssignment', function(req, res) {
        console.log(req.body);
        var assignment = new Assignment();
        assignment.title = req.body.title;
        assignment.description = req.body.description;
        assignment.timestamp = Date.now();
        var dd = new Date(req.body.dueDate);
        var t = new Date(req.body.time);
        assignment.dueDate = dd.setHours(t.getHours());
        console.log(assignment.dueDate);

        Course.findById(req.body.course).exec(function(err, course) {
            if(err) throw err;
            if(course) {
                course._assignments.push(assignment);
                course.save();
                assignment.save();
                res.json({success: true, message: 'Assignment successfully created!'});
            } else {
                res.json({success: false, message: 'Assignment creation failed!'});
            }
        });
    });

    /****************************/
    /* ON ROUTE CHANGE & RELOAD */
    /****** UPDATE PROFILE ******/
    /***** 'JSONIFIES' DATA *****/
    /****************************/
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
                course_list: [],
                documents_list: []
            },
            ta_profile: {
                id: mongoose.Schema.ObjectId,
                course_list: []
            },
            teacher_profile: {
                course_list: []
            }
        };

        // TODO:
        /** UPDATE USERS BEFORE PAYLOAD **/
        /*AbstractUser.findOne({
            username: req.decoded.username
        }).populate({
            path: '_admin',
            model: 'Admin'
        }, {
            path: '_student',
            model: 'Student',
            populate: [{
                path: '_courses',
                model: 'Course',
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
        }, {
            path: '_ta',
            populate: {
                path: '_courses'
            }
        }, {
            path: '_teacher',
            populate: {
                path: '_courses'
            }
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
        });*/

        /** BUILD PAYLOAD **/
        AbstractUser.findOne({
            username: req.decoded.username
        }).populate([{
            path: '_admin',
            model: 'Admin'
        }, {
            path: '_student',
            model: 'Student',
            populate: [{
                path: '_courses',
                model: 'Course'
            }, {
                path: '_documents',
                model: 'Document'
            }]
        }, {
            path: '_ta',
            model: 'Ta',
            populate: {
                path: '_courses',
                model: 'Course'
            }
        }, {
            path: '_teacher',
            model: 'Teacher',
            populate: {
                path: '_courses',
                model: 'Course'
            }
        }]).exec(function(err, user) {
            if(err) throw err;
            if(user) {
                profile_payload.user.username = user.username;
                profile_payload.user.name = user.givenname;
                profile_payload.user.email = user.email;

                if(user._admin !== undefined && user._admin !== null) {
                    profile_payload.admin_profile.id = user._admin._id;
                }

                if(user._student !== undefined && user._student !== null) {
                    profile_payload.student_profile.id = user._student._id;
                    user._student._courses.forEach(function (course) {

                        profile_payload.student_profile.course_list.push({
                            id: course._id,
                            title: course.title
                        });
                    });

                    user._student._documents.forEach(function (document) {
                        profile_payload.student_profile.documents_list.push({
                            id: document._id,
                            title: document.title
                        });
                    });
                }

                if(user._ta !== undefined && user._ta !== null) {
                    profile_payload.ta_profile.id = user._ta._id;
                    user._ta._courses.forEach(function (course) {
                        profile_payload.ta_profile.course_list.push({
                            id: course._id,
                            title: course.title
                        });
                    });
                }

                if(user._teacher !== undefined && user._teacher !== null) {
                    profile_payload.teacher_profile.id = user._teacher._id;
                    user._teacher._courses.forEach(function (course) {
                        profile_payload.teacher_profile.course_list.push({
                            id: course._id,
                            title: course.title
                        });
                    });
                }
            }
            res.send(profile_payload);
        });
    });

    /**
     *
     * COURSE UPLOAD
     */

    // TODO: Add students, teachers, etc.
    router.post('/getCourse', function(req, res) {
        var course_payload = {};

        Course.findById(req.body.id)
        .populate([{
            path: '_assignments',
            model: 'Assignment'
        }, {
            path: '_announcements',
            model: 'Announcement'
        }])
        .exec(function(err, course) {
            if(err) throw err;
            if(course) {
                course_payload.id = course._id;
                course_payload.title = course.title;

                if(course._announcements !== undefined && course._announcements !== null) {
                    course_payload.announcements = [];
                    course._announcements.forEach(function (announcement) {
                        course_payload.announcements.push({
                            id: announcement._id,
                            title: announcement.title,
                            description: announcement.description,
                            timestamp: announcement.timestamp
                        });
                    });
                }
                if(course._assignments !== undefined && course._assignments !== null) {
                    course_payload.assignments = [];
                    course._assignments.forEach(function (assignment) {
                        course_payload.assignments.push({
                            id: assignment._id,
                            title: assignment.title,
                            description: assignment.description,
                            dueDate: assignment.dueDate,
                            timestamp: assignment.timestamp
                            //TODO: add submissions
                        });
                    });
                }
            }
            res.send(course_payload);
        });
    });


    //Sending a document to add
    router.post('/addDocument', function(req, res) {
        var document = new Document();
        document.title = req.body.title;
        document.timestamp = Date.now();
        document.grade = req.body.grade;
        document.status = req.body.status;
        document.submittedTo = req.body.submittedTo;
        document.graph = req.body.graph;
        document.save();
        AbstractUser.findById(req.body.user).exec(function(err, student) {
            if(err) throw err;
            if(student) {
                student._documents.push(document);
                student.save();
                res.send({success: true, message: 'Document successfully saved'});
            } else {
                res.json({success: false, message: 'Document failed to save'});
            }
        });
    });

    router.post('/getDocument', function(req, res) {
        var document_payload = {};

        Document.findById(req.body.id).exec(function(err, document) {
            if(err) throw error;
            if(document) {
                document_payload.id = document._id;
                document_payload.timestamp = document.timestamp;
                document_payload.grade = document.grade;
                document_payload.status = document.status;
                document_payload.graph = document.graph;
                console.log(document_payload);
                res.send(document_payload);
            }
        });
    });


    // TODO: Save document
    router.post('/saveDocument', function(req, res){
        console.log(req.body.doc_id);
        var graph = {
            elements: req.body.elements,
            undoStack: req.body.undoStack
        };
        // TODO: Need to get current document to save the graph to
        Document.findById(req.body.doc_id).exec(function(err, document) {
            if(err) throw err;
            if(document) {
                document.graph = graph;
                document.save();
                res.json({success: true, message: 'Document successfully saved'});
            } else {
                res.json({success: false, message: 'Document failed to save...'});
            }
        });
    });

    // TODO: Save Document

    /** Find, create, open student docs **/
    router.post('/getStudentDocument', function(req, res) {
        var document_payload = {};

        Assignment.findById(req.body.id).populate([{
            path: '_submissions',
            model: 'Document'
        }]).exec(function(err, assignment){
            if(err) throw err;
            if(assignment) {
                Student.findById(req.body.uid).populate([{
                    path: '_documents',
                    model: 'Document'
                }]).exec(function (err, student) {
                    if (err) throw err;
                    if (student) {
                        var sendDoc = false;
                        assignment._submissions.forEach(function (doc1) {
                            student._documents.forEach(function (doc2) {
                                if (doc1._id === doc2._id) {
                                    /**  If document exists send,  **/
                                    /**   Else, create a new one   **/
                                    Document.findById(doc1._id).exec(function (err, document) {
                                        if (err) throw err;
                                        if (document) {
                                            document_payload.id = document._id;
                                            document_payload.grade = document.grade;
                                            document_payload.status = document.status;
                                            document_payload.graph = document.graph;
                                            sendDoc = true;
                                            res.send(document_payload);
                                        }
                                    });
                                }
                            });
                        });

                        if(!sendDoc) {
                            var newDoc = new Document();
                            newDoc.timestamp = Date.now();
                            newDoc.save();
                            assignment._submissions.push(newDoc);
                            student._documents.push(newDoc);
                            document_payload.id = newDoc._id;
                            document_payload.timestamp = newDoc.timestamp;
                            document_payload.status = newDoc.status;
                            document_payload.graph = newDoc.graph;
                            res.send(document_payload);
                        }

                    } else {
                        res.json({success: false, message: 'Student was not found'});
                    }
                });
            } else {
                res.json({ success: false, message: 'Assignment was not found'});
            }
        });
    });

    return router;
};