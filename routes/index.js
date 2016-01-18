var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.redirect('/home');
});

router.get('/home', function(req, res, next){
    res.send('home page');
});

// =============
// LOGIN ROUTES
// =============

router.get('/login', function(req, res, next){res.send('login page');});
router.get('/register', function(req, res, next){res.send('register page');});
router.post('/login', function(req, res, next){res.send('login api');});
router.post('/register', function(req, res, next){res.send('register api');});
router.post('/login_facebook', function(req, res, next){res.send('login facebook api');});

module.exports = router;
