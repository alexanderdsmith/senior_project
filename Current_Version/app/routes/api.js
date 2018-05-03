var AbstractUser = require('../models/abstract_user');
var Admin        = require('../models/admin');
var Assignment   = require('../models/assignment');
var Announcement = require('../models/announcement');
var Course       = require('../models/course');
var Document     = require('../models/document');
var Student      = require('../models/student');
var Ta           = require('../models/ta');
var Instructor   = require('../models/instructor');
var jwt          = require('jsonwebtoken');
var mongoose     = require('mongoose');
var Papa         = require('papaparse');
mongoose.Promise = require('bluebird');

module.exports = function(router, keys) {

    /***************************/
    /* REGISTRATION IS HANDLED */
    /* USING OAUTH IN PASSPORT */
    /***************************/

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
    /**** CSV COURSE UPLOAD ****/
    /***************************/

    // TODO: Fix this so that users can be updated when they already exist! (this is a course upload, not a user auth list!)
    router.post('/uploadCourse', function(req, res) {
        if(req.body.csv !== null && req.body.csv !== '' && typeof(req.body.csv) !== 'undefined') {
            var csv = Papa.parse(req.body.csv, {
                delimiter: ',',
                header: true
            });
            var course = new Course();

            course.title = req.body.title;
            course._students = [];
            course._tas = [];
            course._instructors = [];
            course._announcements = [];
            course._assignments = [];

            course.save();

            /** build course authorized users **/
            for(var i = 0; i < csv.data.length; i++) {
                switch(csv.data[i].Type) {
                    case 'admin': {
                        (function(index) {
                            Admin.findOne({ username: csv.data[index].Username }).exec(function(err, admin) {
                                if(err) throw err;
                                if(admin) {

                                } else {
                                    var newAdmin = new Admin();
                                    newAdmin.username = csv.data[index].Username;
                                    newAdmin.save();
                                }
                            });
                        })(i);
                        break;
                    }
                    case 'student' || '' || null: {
                        (function(index) {
                            Student.findOne({ username: csv.data[index].Username }).exec(function(err, student) {
                                if(err) throw err;
                                if(student) {
                                    student._courses.push(course);
                                    course._students.push(student);
                                    student.save();
                                    course.save();
                                } else {
                                    var newStudent = new Student();
                                    newStudent.username = csv.data[index].Username;
                                    newStudent._courses = [course];
                                    newStudent.save();
                                    course._students.push(newStudent);
                                    course.save();
                                }
                            });
                        })(i);
                        break;
                    }
                    case 'ta' : {
                        (function(index) {
                            Ta.findOne({ username: csv.data[index].Username }).exec(function(err, ta) {
                                if(err) throw err;
                                if(ta) {
                                    ta._courses.push(course);
                                    course._tas.push(ta);
                                    ta.save();
                                    course.save();
                                } else {
                                    var newTa = new Ta();
                                    newTa.username = csv.data[index].Username;
                                    newTa._courses = [course];
                                    newTa.save();
                                    course._tas.push(newTa);
                                    course.save();
                                }
                            });
                        })(i);
                        break;
                    }
                    case 'instructor' : {
                        (function(index) {
                            Instructor.findOne({ username: csv.data[index].Username }).exec(function(err, instructor) {
                                if(err) throw err;
                                if(instructor) {
                                    instructor._courses.push(course);
                                    course._instructors.push(instructor);
                                    instructor.save();
                                    course.save();
                                } else {
                                    var newInstructor = new Instructor();
                                    newInstructor.username = csv.data[index].Username;
                                    newInstructor._courses = [course];
                                    newInstructor.save();
                                    course._instructors.push(newInstructor);
                                    course.save();
                                }
                            });
                        })(i);
                        break;
                    }
                    default: {
                        console.log(csv.data[i].Username + ' was not correctly formatted!\n' + csv.data[i].Type + ' is not a valid type.');
                        break;
                    }
                }
            }

            res.json({ success: true, message: 'CSV file successfully uploaded!' });

        } else {
            res.json({ success: false, message: 'Please select a CSV File!' });
        }
    });

    /****************************/
    /* ON ROUTE CHANGE & RELOAD */
    /****** UPDATE PROFILE ******/
    /***** 'JSONIFIES' DATA *****/
    /****************************/
    router.get('/profileData', function(req, res) {
        /** SEND PAYLOAD (Structure for payload) **/
        var profile_payload = {
            user: {},
            admin_profile: {
                id: mongoose.Schema.ObjectId,
                course_list: []
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
            instructor_profile: {
                course_list: []
            }
        };

        Course.find({}).exec(function(err, courses) {
            if(err) throw err;
            if(courses) {
                courses.forEach(function (course) {
                    var s = course._students;
                    var i = course._instructors;
                    var t = course._tas;
                    var uniqueS = s.filter(function (elem, pos) {
                        return s.indexOf(elem) === pos;
                    });
                    var uniqueI = i.filter(function (elem, pos) {
                        return i.indexOf(elem) === pos;
                    });
                    var uniqueT = t.filter(function (elem, pos) {
                        return t.indexOf(elem) === pos;
                    });
                    course._students = uniqueS;
                    course._instructors = uniqueI;
                    course._tas = uniqueT;

                    course.save();

                    profile_payload.admin_profile.course_list.push(course);
                });
            }
        });

        /** BUILD PAYLOAD **/
        // TODO: list ALL existing courses in admin_profile
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
            path: '_instructor',
            model: 'Instructor',
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
                console.log(user.usertypes.filter(function(a){return a !== ''}));
                profile_payload.user.usertypes = user.usertypes.filter(function(a){return a !== ''});

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

                if(user._instructor !== undefined && user._instructor !== null) {
                    profile_payload.instructor_profile.id = user._instructor._id;
                    user._instructor._courses.forEach(function (course) {
                        profile_payload.instructor_profile.course_list.push({
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
     * COURSE PAYLOAD
     */

    // TODO: Add types (students, instructors, etc.)
    router.post('/getCourse', function(req, res) {
        var course_payload = {};

        Course.findById(req.body.id)
        .populate([{
            path: '_assignments',
            model: 'Assignment'
        }, {
            path: '_announcements',
            model: 'Announcement'
        }, {
            path: '_students',
            model: 'Student'
        }, {
            path: '_instructors',
            model: 'Instructor'
        }, {
            path: '_tas',
            model: 'Ta'
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
                            postedBy: announcement.postedBy,
                            description: announcement.description,
                            timestamp: announcement.timestamp
                        });
                    });
                }
                if(course._assignments !== undefined && course._assignments !== null) {
                    course_payload.assignments = [];
                    course._assignments.forEach(function (assignment) {
                        var documents = [];
                        console.log(assignment);
                        /*if (assignment._submissions !== undefined && course._assignments !== null) {
                            assignment._submissions.forEach(function (document) {

                                documents.push({
                                    id: document._id,
                                    sid: document._student._id,
                                    student: document._student.username
                                });
                            });
                        }*/
                        course_payload.assignments.push({
                            id: assignment._id,
                            title: assignment.title,
                            description: assignment.description,
                            dueDate: assignment.dueDate,
                            timestamp: assignment.timestamp,
                            documents: documents
                        });
                    });
                }
                if(course._instructors !== undefined && course._instructors !== null) {
                    course_payload.instructors = [];
                    course._instructors.forEach(function (instructor) {
                        course_payload.instructors.push({
                            id: instructor._id,
                            username: instructor.username
                        });
                    });
                }
                if(course._students !== undefined && course._students !== null) {
                    course_payload.students = [];
                    course._students.forEach(function (student) {
                        course_payload.students.push({
                            id: student._id,
                            username: student.username
                        });
                    });
                }
                if(course._tas !== undefined && course._tas !== null) {
                    course_payload.tas = [];
                    course._tas.forEach(function (ta) {
                        course_payload.tas.push({
                            id: ta._id,
                            username: ta.username
                        });
                    });
                }
            }
            res.send(course_payload);
        });
    });

    router.post('/addAnnouncement', function(req, res) {
        console.log(req.body);
        var announcement = new Announcement();
        announcement.description = req.body.text;
        announcement.timestamp = Date.now();
        announcement.postedBy = req.body.postedBy;

        Course.findById(req.body.course).exec(function(err, course) {
            if(err) throw err;
            if(course) {
                course._announcements.push(announcement);
                course.save();
                announcement.save();
                res.json({success: true, message: 'Announcement successfully created'});
            } else {
                res.json({success: false, message: 'Announcement upload failed'});
            }
        });
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
        assignment.dueDate.setMinutes(t.getMinutes());
        assignment.pastDue = false;

        Course.findById(req.body.course).exec(function(err, course) {
            if(err) throw err;
            if(course) {
                course._assignments.push(assignment);
                course.save();
                assignment.save();
                res.json({success: true, message: 'Assignment successfully created'});
            } else {
                res.json({success: false, message: 'Assignment upload failed'});
            }
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

    router.post('/submitDocument', function(req, res) {
        Document.findById(req.body.id, function(err, document) {
            if(err) throw err;
            if(document) {
                document.status = 'submitted';
                document.submitTime = Date.now();
                document.save();
                res.json({success: true, message: 'Document successfully submitted'});
            } else {
                res.json({success: false, message: 'No document found to submit!'});
            }
        });
    });

    /** Find, create, open student docs **/
    router.post('/getStudentDocument', function(req, res) {
        var document_payload = {};

        Assignment.findById(req.body.id).populate([{
            path: '_submissions',
            model: 'Document',
            populate: {
                path: '_student'
            }
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
                                console.log(doc1._id.equals(doc2._id));
                                if (doc1._id.equals(doc2._id)) {
                                    sendDoc = true;
                                    /**  If document exists send,  **/
                                    /**   Else, create a new one   **/
                                    Document.findById(doc1._id).exec(function (err, document) {
                                        if (err) throw err;
                                        if (document) {
                                            console.log(document._id);
                                            document_payload.id = document._id;
                                            document_payload.grade = document.grade;
                                            document_payload.status = document.status;
                                            document_payload.graph = document.graph;
                                            res.send(document_payload);
                                        }
                                    });
                                }
                            });
                        });

                        if(!sendDoc) {
                            var newDoc = new Document();
                            newDoc.timestamp = Date.now();
                            newDoc._student = student;
                            newDoc.save();
                            assignment._submissions.push(newDoc);
                            student._documents.push(newDoc);
                            assignment.save();
                            student.save();
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