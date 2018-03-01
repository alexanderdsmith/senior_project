var mongoose     = require('mongoose');
var AbstractUser = require('./abstract_user');
var Admin        = require('./admin');
var Student      = require('./student');
var Ta           = require('./ta');
var Teacher      = require('./teacher');
var Schema       = mongoose.Schema;

var AuthListSchema = new Schema({
    authorized : [{ type: String }],
    usertype   : {
        type      : String,
        required  : true,
        lowercase : true,
        unique    : true,
        // can add new types
        enum      : ['admin', 'student', 'ta', 'teacher']
    }
});

// AuthList.createList(list); will initialize the list (will run once per server)
AuthListSchema.methods.createList = function(list) {
    for(var i = 0; i < list.length; i++) {
        this.authorized.push(list[i]);
    }
    this.save();
};

// ensures users are not double authenticated!
// AuthList.updateList(list_additions); will update the authenticated users list
AuthListSchema.methods.updateList = function(list_additions) {
    // Admin list updates on restart
    var thistype = this.usertype;

    for(var i = 0; i < list_additions.length; i++) {
        if (this.authorized.indexOf(list_additions[i]) === -1) {
            this.authorized.push(list_additions[i]);

            AbstractUser.findOne({ username: list_additions[i] }).exec(function(err, user) {
                if(err) throw err;
                if(user) {
                    switch(thistype) {
                        case 'admin': {
                            user._admin = new Admin();
                            user.usertypes.push('admin');
                            user.save(function(err) {
                                if(err) {
                                    console.log('could not save user!');
                                } else {
                                    console.log('user successfully updated!');
                                }
                            });
                            break;
                        }
                        case 'student': {
                            user._student = new Student();
                            user.usertypes.push('student');
                            user.save(function(err) {
                                if(err) {
                                    console.log('could not save user!');
                                } else {
                                    console.log('user successfully updated!');
                                }
                            });
                            break;
                        }
                        case 'ta': {
                            user._ta = new Ta();
                            user.usertypes.push('ta');
                            user.save(function(err) {
                                if(err) {
                                    console.log('could not save user!');
                                } else {
                                    console.log('user successfully updated!');
                                }
                            });
                            break;
                        }
                        case 'teacher': {
                            user._teacher = new Teacher();
                            user.usertypes.push('teacher');
                            user.save(function(err) {
                                if(err) {
                                    console.log('could not save user!');
                                } else {
                                    console.log('user successfully updated!');
                                }
                            });
                            break;
                        }
                    }
                }
            });
        }
    }
    this.save();
};

module.exports = mongoose.model('AuthList', AuthListSchema);