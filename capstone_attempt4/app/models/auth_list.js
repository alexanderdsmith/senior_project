var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var AuthListSchema = new Schema({
    authorized : [{ type: String }],
    usertype : {
        type      : String,
        required  : true,
        lowercase : true,
        unique    : true,
        // can add new types
        enum      : ['admin', 'student', 'teacher']
    }
});

// AuthList.createList(list); will initialize the list (will run once per server)
AuthListSchema.methods.createList = function(list) {
    for(var i = 0; i < list.length; i++) {
        this.authorized.push(list[i]);
    }
    this.save();
};

// AuthList.updateList(list_additions); will update the authenticated users list
AuthListSchema.methods.updateList = function(list_additions) {
    // Admin list updates on restart
    for(var i = 0; i < list_additions.length; i++) {
        if (this.authorized.indexOf(list_additions[i]) === -1) {
            this.authorized.push(list_additions[i]);
        }
    }
    this.save();
};

module.exports = mongoose.model('AuthList', AuthListSchema);