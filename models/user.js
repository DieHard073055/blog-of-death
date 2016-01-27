var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

//define the schema for our user model

var userSchema = mongoose.Schema({
    account:{
        id          : String,
        token       : String,
        email       : String,
        password    : String,
        name        : String,
        admin       : Boolean
    }
    
});

// Generating a hash
userSchema.methods.generateHash = function(password){
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// Checking if a password is valid
userSchema.methods.validPassword = function(password){
    return bcrypt.compareSync(password, this.account.password);
};

module.exports = mongoose.model('User', userSchema);

