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
        unique: true,
        default: 'student',
        // can add new types here
        enum: ['admin', 'student', 'teacher']
    }
});

// AuthList.createList(list); will initialize the list (will run once per server)
AuthListSchema.methods.createList = function(list) {
    for(var i = 0; i < list.length; i++) {
        this.authlist.push(list[i]);
    }
    this.save();
};

// AuthList.updateList(list_additions); will update the authenticated users list
AuthListSchema.methods.updateList = function(list_additions) {
    // Admin list updates on restart
    for(var i = 0; i < list_additions.length; i++) {
        if (this.authlist.indexOf(list_additions[i]) === -1) {
            this.authlist.push(list_additions[i]);
        }
    }
    this.save();
};

module.exports = mongoose.model('AuthList', AuthListSchema);