var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var AuthListSchema = new Schema({
    authlist: [{
        type: String
    }],
    // TODO: convert to enum
    usertype: {
        type: String,
        required: true,
        lowercase: true,
        unique: true
    }
});

AuthListSchema.methods.createList = function(list) {
    this.authlist.concat(list);
    console.log('list creation successful');
    this.save();
};

// AuthList.updateList(list_additions); will update the authenticated users list
AuthListSchema.methods.updateList = function(list_additions) {
    // Admin list updates on restart
    // TODO: do not add repeats to the list
    for(var i = 0; i < list_additions.length; i++) {
        if(this.authlist.indexOf(list_additions[i]) === -1) {
            this.authlist.push(list_additions[i]);
        }
    }
    console.log(this.authlist);
    this.save();
};

module.exports = mongoose.model('AuthList', AuthListSchema);