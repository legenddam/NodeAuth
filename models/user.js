var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/nodeauth');

var db = mongoose.connection;

var bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema({
    username : {
        type : String,
        index : true
    },
    name :
    {
        type : String
    },
    email : 
    {
        type : String
    },
    password : 
    {
        type : String
    },
    profileimage :
    {
        type : String
    }
});

var user = module.exports = mongoose.model('user', userSchema);

module.exports.createUser = function(newUser, callback)
{
    bcrypt.genSalt(10, function(err, salt){
        bcrypt.hash(newUser.password, salt, function(err, hash) {
            newUser.password = hash;             // Store hash in your password DB.
            newUser.save(callback);
        });
    });
}

module.exports.getUserbyUsername = function(username, callback){
    user.findOne({username : username}, callback);
}

module.exports.comparePassword = function(password, hash, callback){
    bcrypt.compare(password, hash, callback);
}
module.exports.getUserbyId = function(id, callback){
    user.findById(id, callback);
}