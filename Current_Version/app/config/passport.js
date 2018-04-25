var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var AbstractUser   = require('../models/abstract_user.js');
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
            usertypes : user.usertypes
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
        console.log(profile);
        AbstractUser.findOne({ email: profile.emails[0].value }).exec(function(err, user) {
            if(err) done(err);
            if(user && user !== null) {
                if(user.givenname === '' || user.givenname === null) {
                    user.givenname = profile.displayName;
                    user.save();
                }
                done(null, user);
            } else {    // TODO: create user with no permissions!
                done(err);
            }
        });
    }));

    app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/google-error'}), function(req, res) {
        res.redirect('/google/' + token);
    });

    app.get('/auth/google', passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login', 'profile', 'email'] }));

    return passport;
};