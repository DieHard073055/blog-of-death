var restrictedModules = {
    'add_blog':true,
    'edit_blog':true,
    'delete_blog':true,
    'add_topics':true,
    'delete_comments':true,
    'delete_topics':true,
    'delete_blog':true
    
};

var restrictedPages = {
    '/blogs/create_blog':true,
    '/blogs/edit_blog':true
};
var isAllowedWrite = function(req, res, next){
    console.log(req.originalUrl);
    if(restrictedModules[req.body.module]){
        if(req.isAuthenticated()){
            if(req.user.account.admin){
                console.log('-----user allowed');
                return next();

            }
        }
        res.send('Sorry you are not allowed here');
    }else  next();
};
var isAllowedHere = function(req, res, next){
    if(req.isAuthenticated()){
        if(req.user.account.admin){
            return next();
        }
    }
    res.send('Sorry you are not allowed here');
};
var isAllowedComment = function(req, res, next){
    if(req.body.module == 'add_comment'){
    if(req.isAuthenticated())
        if(req.user.account.token) return next();
            res.send('Sorry, you cannot comment');
    }
    return next();
};

var loggedInRouteHome = function(req, res, next){
    if(req.isAuthenticated())res.redirect('/home');
    else return next();
};


module.exports.isAllowedHere = isAllowedHere;
module.exports.isAllowedWrite = isAllowedWrite;
module.exports.isAllowedComment = isAllowedComment;
module.exports.loggedInRouteHome = loggedInRouteHome;
