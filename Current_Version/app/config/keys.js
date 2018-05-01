// TODO: add config.json to .gitignore...

var AbstractUser = require('../models/abstract_user');
var Admin = require('../models/admin');
var config = require('../../config.json');
var isBroken = false;

js_config = JSON.parse(JSON.stringify(config)); // convert config into js readable format

if(config === null || config === '') {
    isBroken = true;
}

if(isBroken) {
    module.exports = 'Please check configuration!';
} else {
    js_config.google.callbackURL = js_config.URL + '/auth/google/callback';

    // Create lists and populate admin list with the appropriate admin rights

    if(js_config.admins) {
        for (var i = 0; i < js_config.admins.length; i++) {
            (function(index) {
                AbstractUser.findOne({ username: js_config.admins[index]}).exec(function(err, user){
                    if(err) throw err;
                    if(user) {
                        if (user.usertypes.indexOf('admin') === -1) {
                            var admin = new Admin();
                            admin.username = user.username;
                            admin.save();
                            user._admin = admin;
                            user.usertypes = ['admin','','',''];
                            user.save();
                        }
                    } else {
                        var newUser = new AbstractUser();
                        var newAdmin = new Admin();
                        newAdmin.username = js_config.admins[index];
                        newUser.username = js_config.admins[index];
                        newUser.email = js_config.admins[index] + '@slu.edu';
                        newUser.usertypes = ['admin','','',''];
                        newAdmin.save();
                        newUser.save();
                        console.log('New admin: ' + js_config.admins[index] + ' was created!');
                    }
                });
            })(i);
        }
    }
}

module.exports = js_config;