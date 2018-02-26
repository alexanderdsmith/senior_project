var AbstractUser = require('../models/abstract_user');
var jwt          = require('jsonwebtoken');

module.exports = function(router, keys) {

    // user registration
    router.post('/users', function(req, res) {
        var user = new AbstractUser();
        user.username = req.body.username;
        console.log(req.body.username);
        user.password = req.body.password;
        user.email    = req.body.email;
        if(req.body.username === null || req.body.username === '' || req.body.password === null || req.body.password === '' || req.body.email === null || req.body.email === '') {
            res.json({ success: false, message: 'Ensure username, password, and email are provided' });

        } else {
            user.save(function(err) {
                if(err) {
                    res.json({ success: false, message: 'Username or email already exists!' });
                } else {
                    res.json({ success: true, message: 'User successfully created!' });
                }
            })
        }
    });

    router.post('/authenticate', function(req, res) {
        AbstractUser.findOne({ username: req.body.username }).select('email username password').exec(function(err, user) {
            if(err) throw err;
            if(!user) {
                res.json({ success: false, message: 'Could not find user!' });
            } else if(user) {
                if (req.body.password) {
                    var validPassword = user.comparePassword(req.body.password);
                    if (!validPassword) {
                        res.json({success: false, message: 'Incorrect password!'});
                    } else {
                        var token = jwt.sign({ username: user.username, email: user.email }, keys.encryption.secret, { expiresIn: keys.encryption.expiration });
                        res.json({success: true, message: 'User authenticated', token: token });
                    }
                } else {
                    res.json({success: false, message: 'No password provided.'});
                }
            }
        })
    });

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
        } else {
            res.json({ success: false, message: 'no token provided' });
        }
    });

    router.post('/currUser', function(req, res) {
        res.send(req.decoded);
    });

    return router;
};