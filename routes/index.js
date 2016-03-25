var express = require('express');
var router = express.Router();
var loggedInRouteHome = require('../modules/authenticated').loggedInRouteHome;

module.exports = function(app, passport){

    /* GET home page. */
    router.get('/', loggedInRouteHome,function(req, res, next) {
      var data={title:'blog-of-death'};
      res.render('index', data);
    });

    // ==========================
    // LOGIN PAGE
    // ===========

    router.get('/login', loggedInRouteHome, function(req, res){
        
        var data={title:'blog-of-death'};
        data.message = req.flash('loginMessage');
        res.render('login', data);
    });

    router.post('/login', passport.authenticate('local-login', {
            
        successRedirect : '/home',
        failureRedirect : '/login',
        failureFlash : true

    }));

    // ==========================
    // SIGNUP PAGE
    // ============
/*
    router.get('/signup', loggedInRouteHome, function(req, res){
        var data={title:'blog-of-death'};
        data.message = req.flash('signupMessage');
        res.render('signup', data);
    });

    router.post('/signup', passport.authenticate('local-signup', {
        successRedirect : '/home',
        failureRedirect : '/signup',
        failureFlash : true
    }));
        
*/    

    // ==========================
    // home SELECTION
    // =================

    router.get('/home', isLoggedIn, function(req, res){ 
        var data={title:'blog-of-death'};
        data.user = req.user;
        res.render('home', data);
    });

    // ==============
    // FACEBOOK AUTH
    // ==============

    router.get('/auth/facebook', passport.authenticate('facebook', { scope:['email']}));
    router.get('/auth/facebook/callback',
        passport.authenticate('facebook',{
            successRedirect : '/home',
            failureRedirect : '/'
        }
    ));
    
    // ==========================
    // LOGOUT
    // ======

    router.get('/logout', function(req, res){
        req.logout();
        res.redirect('/');
    }); 
    router.get('/logout/:redirect', function(req, res){      
        req.logout();
        console.log(req.params.redirect);
        res.redirect('/'+req.params.redirect);
    });


    app.use('/', router);
};

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()) return next();
    res.redirect('/');
}
