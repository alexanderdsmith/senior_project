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
}

module.exports = js_config;