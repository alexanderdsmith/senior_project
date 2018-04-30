// TODO: add config.json to .gitignore...

var AuthList = require('../models/auth_list');
var config = require('../../config.json');
var isBroken = false;

js_config = JSON.parse(JSON.stringify(config)); // convert config into js readable format
// check and correct format of the json file... (assume everything else is ok..)
if(config === null || config === '') {
    isBroken = true;
}

if(isBroken) {
    module.exports = 'Please check configuration!';
} else {
    js_config.google.callbackURL = js_config.URL + '/auth/google/callback';

    // Create lists and populate admin list with the appropriate admin rights
    AuthList.findOne({ usertype: 'admin' }).select('authorized usertype').exec(function(err, list) {
        if(err) throw err;
        if(!list) {
            console.log('no list exists, so make one for: ' + 'admin');
            var alist = new AuthList();
            alist.authorized = [];
            alist.usertype = 'admin';
            alist.updateList(js_config.admins);
        } else if(list) {
            list.updateList(js_config.admins);
        }
    });
    AuthList.findOne({ usertype: 'student'} ).exec(function(err, list) {
        if(err) throw err;
        if(!list) {
            var alist = new AuthList();
            alist.authorized = [];
            alist.usertype = 'student';
            alist.save(function (err) {
                if (err) throw err;
                else {
                    console.log('student list created!');
                }
            });
        }
    });
    AuthList.findOne({ usertype: 'ta'} ).exec(function(err, list) {
        if(err) throw err;
        if(!list) {
            var alist = new AuthList();
            alist.authorized = [];
            alist.usertype = 'ta';
            alist.save(function (err) {
                if (err) throw err;
                else {
                    console.log('ta list created!');
                }
            });
        }
    });
    AuthList.findOne({ usertype: 'instructor'} ).exec(function(err, list) {
        if(err) throw err;
        if(!list) {
            var alist = new AuthList();
            alist.authorized = [];
            alist.usertype = 'instructor';
            alist.save(function (err) {
                if (err) throw err;
                else {
                    console.log('instructor list created!');
                }
            });
        }
    });
}

module.exports = js_config;