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
    AuthList.findOne({ usertype: 'admin' }).select('authorized usertype').exec(function(err, list) {
        if(err) throw err;
        if(!list) {
            console.log('no list exists, so make one for: ' + 'admin');
            var alist = new AuthList();
            alist.authorized = [];
            alist.usertype = 'admin';
            alist.createList(js_config.admins);
        } else if(list) {
            list.updateList(js_config.admins);
        }
    });
}

module.exports = js_config;