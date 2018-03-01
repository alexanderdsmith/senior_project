var AbstractUser = require('../models/abstract_user');
var Admin        = require('../models/admin');
var AuthList     = require('../models/auth_list');
var Student      = require('../models/student');
var Ta           = require('../models/ta');
var Teacher      = require('../models/teacher');
var jwt          = require('jsonwebtoken');
var Papa         = require('papaparse');

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
            AuthList.findOne({ authorized: user.username }).exec(function(err, list) {
                if(err) throw err;
                if(list.authorized.indexOf(user.username) === -1) {
                    res.json({ success: false, message: 'User has not been authorized' });
                }
                if(list.usertype === 'student' || list.usertype === '' || list.usertype === null) {
                    user._student = new Student();
                    user.usertypes.push('student');
                    user.save(function(err) {
                        if(err) {
                            res.json({ success: false, message: 'Username or email already exists!' });
                        } else {
                            res.json({ success: true, message: 'Student account successfully created!' });
                        }
                    });
                }
                if(list.usertype === 'ta') {
                    user._ta = new Ta();
                    user.usertypes.push('ta');
                    user.save(function(err) {
                        if(err) {
                            res.json({ success: false, message: 'Username or email already exist!' });
                        } else {
                            res.json({ success: true, message: 'TA account successfully created!' });
                        }
                    })
                }
                if(list.usertype === 'teacher') {
                    user._teacher = new Teacher();
                    user.usertypes.push('teacher');
                    user.save(function(err) {
                        if(err) {
                            res.json({ success: false, message: 'Username or email already exists!' });
                        } else {
                            res.json({ success: true, message: 'Teacher account successfully created!' });
                        }
                    });
                }
                if(list.usertype === 'admin') {
                    user._admin = new Admin();
                    user.usertypes.push('admin');
                    user.save(function(err) {
                        if(err) {
                            res.json({ success: false, message: 'Username or email already exists!' });
                        } else {
                            res.json({ success: true, message: 'Admin account successfully created!' });
                        }
                    });
                }
            });
        }
    });

    /***************************/
    /**** AUTHENTICATE USER ****/
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
    router.post('/uploadAuthList', function(req, res) {
        if(req.body.csv !== null && req.body.csv !== '') {
            var csv = Papa.parse(req.body.csv, {
                delimiter: ',',
                header: true
            });

            var adminlist   = [];
            var studentlist = [];
            var talist      = [];
            var teacherlist = [];

            for(var i = 0; i < csv.data.length; i++) {
                switch(csv.data[i].Type) {
                    case 'admin': {
                        adminlist.push(csv.data[i].Username);
                        break;
                    }
                    case 'student' || '' || null : {
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
                    list.updateList(adminlist);
                } else {
                    res.json({ success: false, message: 'CSV file is not correctly formatted!' });
                }
            });

            AuthList.findOne({ usertype: 'student' }).exec(function (err, list) {
                if (err) throw err;
                if(list) {
                    list.updateList(studentlist);
                } else {
                    res.json({ success: false, message: 'CSV file is not correctly formatted!' });
                }
            });

            AuthList.findOne({ usertype: 'ta' }).exec(function (err, list) {
                if (err) throw err;
                if(list) {
                    list.updateList(talist);
                } else {
                    res.json({ success: false, message: 'CSV file is not correctly formatted!' });
                }
            });

            AuthList.findOne({ usertype: 'teacher' }).exec(function (err, list) {
                if (err) throw err;
                if(list) {
                    list.updateList(teacherlist);
                } else {
                    res.json({ success: false, message: 'CSV file is not correctly formatted!' });
                }
            });

            res.json({ success: true, message: 'CSV file successfully uploaded!' });

        } else {
            res.json({ success: false, message: 'CSV file was not correctly formatted!' });
        }
    });

    /****************************/
    /****** SEND  SECTIONS ******/
    /****************************/
    router.post('/sections', function(req, res) {

    });

    return router;
};