var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var AbstractUser   = require('../models/abstract_user.js');
var Admin          = require('../models/admin');
var Instructor     = require('../models/instructor');
var Student        = require('../models/student');
var Ta             = require('../models/ta');
var session        = require('express-session');
var jwt            = require('jsonwebtoken');

module.exports = function(app, passport, keys) {
    var secret = keys.encryption.secret;
    var token;

    app.use(passport.initialize());
    app.use(passport.session());
    app.use(session({
        secret            : secret,
        resave            : false,
        saveUninitialized : true,
        cookie            : {
            secure: false
        }
    }));

    passport.serializeUser(function(user, done) {
        token = jwt.sign({
            givenname : user.givenname,
            username  : user.username,
            email     : user.email,
            usertypes : user.usertypes.filter(function(a){return a !== ''})
        }, secret, { expiresIn: keys.encryption.expiration });
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        AbstractUser.findById(id, function(err, user) {
            done(err, user);
        });
    });

    passport.use(new GoogleStrategy({
        clientID     : keys.google.clientID,
        clientSecret : keys.google.clientSecret,
        callbackURL  : keys.google.callbackURL
    }, function(accessToken, refreshToken, profile, done) {
        AbstractUser.findOne({ email: profile.emails[0].value }).exec(function(err, user) {
            if(err) done(err);
            if(user) {

                if (!user.givenname) {
                    user.givenname = profile.displayName;
                    user.save();
                }

                /** Check & Update user **/

                if (user.usertypes.indexOf('admin') === -1) {
                    Admin.findOne({username: user.username}).then(function (admin) {
                        if(err) throw err;
                        if (admin) {
                            user.usertypes.set(0, 'admin');
                            user._admin = admin;
                            user.save();
                        }
                    });
                }

                if (user.usertypes.indexOf('instructor') === -1) {
                    Instructor.findOne({username: user.username}).exec(function (err, instructor) {
                        if(err) throw err;
                        if (instructor) {
                            user.usertypes.set(1, 'instructor');
                            user._instructor = instructor;
                            user.save();
                        }
                    });
                }

                if (user.usertypes.indexOf('student') === -1) {
                    Student.findOne({username: user.username}).exec(function (err, student) {
                        if(err) throw err;
                        if (student) {
                            user.usertypes.set(2, 'student');
                            user._student = student;
                            user.save();
                        }
                    });
                }

                if (user.usertypes.indexOf('ta') === -1) {
                    Ta.findOne({username: user.username}).then(function (ta) {
                        if(err) throw err;
                        if (ta) {
                            user.usertypes.set(3, 'ta');
                            user._ta = ta;
                            user.save();
                        }
                    });
                }

                done(null, user);

            } else {

                if(profile.emails[0].value.substr(profile.emails[0].value.indexOf('@')) !== '@slu.edu') {
                    done(err);
                } else {
                    var newUser = new AbstractUser();
                    newUser.email = profile.emails[0].value;
                    newUser.givenname = profile.displayName;
                    newUser.username = newUser.email.substring(0, newUser.email.indexOf('@'));
                    newUser.usertypes = ['','','',''];
                    Admin.findOne({ username: newUser.username }).exec(function(err, admin) {
                        if(err) throw err;
                        if(admin) {
                            newUser._admin = admin;
                            newUser.usertypes = ['admin'];
                            newUser.save();
                        }
                    });
                    Instructor.findOne({ username: newUser.username }).exec(function(err, instructor) {
                        if(err) throw err;
                        if(instructor) {
                            newUser._instructor = instructor;
                            newUser.usertypes = ['instructor'];
                            newUser.save();
                        }
                    });
                    Student.findOne({ username: newUser.username }).exec(function(err, student) {
                        if(err) throw err;
                        if(student) {
                            newUser._instructor = student;
                            newUser.usertypes = ['student'];
                            newUser.save();
                        }
                    });
                    Ta.findOne({ username: newUser.username }).exec(function(err, ta) {
                        if(err) throw err;
                        if(ta) {
                            newUser._instructor = ta;
                            newUser.usertypes = ['ta'];
                            newUser.save();
                        }
                    });
                    newUser.save();
                    done(null, newUser);
                }
            }
        });
    }));

    app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/google-error'}), function(req, res) {
        res.redirect('/google/' + token);
    });

    app.get('/auth/google', passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login', 'profile', 'email'] }));

    return passport;
};