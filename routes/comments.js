var express = require('express');
var router = express.Router();
var authFunctions = require('../modules/authenticated');
var isAllowedComment = authFunctions.isAllowedComment;

module.exports = function(app, passport){
    var request_modules = {
        'all_comments' : require('../modules/all_comments'),
        'add_comment' : require('../modules/add_comment'),
        'comment_blog' : require('../modules/comment_blog'),
        'delete_comment' : require('../modules/delete_comment')
    };

    router.post('/',isAllowedComment ,function(req, res, next){
        module = req.body.module;
        if(req.user) req.body.user = req.user.account;
        console.log('/comment | post | Recieved : ' + JSON.stringify(req.body));
        if(request_modules[module]) request_modules[module](req.body, res);
        else res.send(JSON.stringify(
            { 'error' : 'Requested module cannot be found' }
            )
        );
    });
    app.use('/comments', router);
};
