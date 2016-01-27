var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;

var User = require('../models/user');
var configAuth = require('./auth');
module.exports = function(passport){
    // =======================
    // Passport session setup
    // =======================
    //
    // serialize user for session
    passport.serializeUser(function(user, done){
        done(null, user.id);
    });

    // used to deserialize user
    passport.deserializeUser(function(id, done){
        User.findById(id, function(err, user){
            done(err, user);
        });
    });

    // ============
    // LOCAL SIGNUP
    // ============
    
    passport.use('local-signup', new LocalStrategy({
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true
    },
    function(req, email, password, done){
        console.log(req.body);
        console.log(email);
        console.log(password);
        //user.findOne wont fire unless data is sent back
        process.nextTick(function(){
            User.findOne({
            'account.email' : email
            },
            function(err, user){
                if(err) return done(err);
                if(user){
                    return done(null, false, req.flash('signupMessage','That email is already taken.'));
                }else{
                    var newUser = new User();
                    newUser.account.name = req.body.name;
                    newUser.account.email = email;
                    newUser.account.password = newUser.generateHash(password);
                    newUser.account.admin = true;

                    newUser.save(function(err){
                        if(err) throw err;
                        return done(null, newUser);
                    });
                }
            });
        });
    }));

    // ===========
    // LOCAL LOGIN
    // ===========

    passport.use('local-login', new LocalStrategy({
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true
    },
    function(req, email, password, done){
        User.findOne({'account.email': email}, function(err, user){
            if(err) return done(err);
            if(!user) return done(null, false, req.flash('loginMessage', 'No user found'));
            if(!user.validPassword(password)) return done(null, false, req.flash('loginMessage','Oops! Wrong password'));
            return done(null, user);
        });
    }));
    
    // ===============
    // FACEBOOK
    // ==============

    passport.use(new FacebookStrategy({

        clientID        : configAuth.facebookAuth.clientID,
        clientSecret    : configAuth.facebookAuth.clientSecret,
        callbackURL     : configAuth.facebookAuth.callbackURL,
        profileFields   : ['id', 'emails', 'name']
    },
    function(token, refreshToken, profile, done){
        process.nextTick(function(){
            User.findOne({'account.id' : profile.id}, function(err, user){
                if (err) return done(err);
                if (user){ return done(null, user); }
                else{ 
                    var newUser = new User();
                    console.log(profile);
                    newUser.account.id = profile.id;
                    newUser.account.token = token;
                    newUser.account.name = profile.name.givenName + ' ' + profile.name.familyName;
                    newUser.account.email = profile.emails[0].value;

                    newUser.save(function(err){
                        if(err) throw err;
                        return done(null, newUser);
                    });
                }
            });
        });
    }));
};
