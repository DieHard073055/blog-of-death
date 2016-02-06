var express = require('express');
var router = express.Router();
var post_router = express.Router();
var authFunctions = require('../modules/authenticated');
var isAllowedHere = authFunctions.isAllowedHere;
var isAllowedWrite = authFunctions.isAllowedWrite;
module.exports = function(app, passport){
    /****************************************************************************************
     * REST API *
     ************
     *
     *  '/blogs' - via post
     *      
     *      -all_blogs : Gives a list of all the blogs [ title | author | topic | tags ]
     *      -blog : [id] Give all the data about the blog with the given id
     *      -add_blog : [ title, author, topic, tags[], 
     *          pages[{ body, subtitle, datemodified, comments }] ]
     *                  : Create a new blog from the given data
     *      -edit_blog : [id] update the blog with the id
     *      -blog_topic : [topic] Give a list of all the blogs with [ title | author | tags ]
     *                      for the given topic
     *      -blog_tag : [tag] Give a list of all the blogs with [ title | author | topic ]
     *                  for a given tag
     *
     *****************************************************************************************/
    var request_modules = {
        'all_blogs' : require('../modules/all_blogs'),
        'blog' : require('../modules/blog'),
        'add_blog' : require('../modules/add_blog'),
        'edit_blog' : require('../modules/edit_blog'),
        'blog_topic' : require('../modules/blog_topic'),
        'blog_tag' : require('../modules/blog_tag'),
        'delete_blog' : require('../modules/delete_blog')
    };
    router.post('/',isAllowedWrite, function(req, res, next){
        module = req.body.module;
        console.log('/blogs | post | Recieved : ' + JSON.stringify(req.body));
        if(req.user)
        req.body.author = req.user.account.name;
        if(request_modules[module]) request_modules[module](req.body, res);
        else res.send(JSON.stringify(
            { 'error' : 'Requested module cannot be found' }
            )
        );
    });

    /*****************************************************************************************
     * FRONT END *
     *************
     *
     * '/blogs' :- Shows a list of all blogs
     * '/blogs/show_blog/:id' :- Shows the blog with id :id
     * '/blogs/create_blog' :- Shows the create blog page
     * '/blogs/edit_blog' :- Show a list of all the blogs which can be edited|removed|viewed
     * '/blogs/edit_blog/:id' : Shows the edit page for the blog with id :id
     *
     ******************************************************************************************/


    router.get('/', function(req, res, next){
        data = {};
        data.title = 'Blogs';
        data.user = req.user;
        res.render('blogs/blogs', data);    
    });
    router.get('/show_blog/:id', function(req, res, next){
        var data={};
        data.title = 'blogs of death';
        data.id = req.params.id;
        data.user = req.user;
        res.render('blogs/show_blog', data);    
    });
    router.get('/create_blog',isAllowedHere, function(req, res, next){
        data = {};
        data.title = 'Create A Blog';
        data.user = req.user;
        res.render('blogs/create_blog', data);
    });
    router.get('/edit_blog',isAllowedHere, function(req, res, next){
        data = {};
        data.title = 'Edit Blog';
        data.user = req.user;
        res.render('blogs/edit_blog', data);
    });
    router.get('/edit_blog/:id',isAllowedHere, function(req, res, next){
        data = {};
        data.title = 'Edit Blog';
        data.user = req.user;
        data.id = req.params.id;
        res.render('blogs/edit_blog_page', data);
    });
    router.get('/blog_topic', function(req, res, next){
        data = {};
        data.title = 'Blog Topics';
        data.user = req.user;
        res.redirect('/blogs', data);
    });
    router.get('/blog_topic/:topic_name', function(req, res, next){
        data = {};
        data.title = 'Blog Topics';
        data.user = req.user;
        if(req.params.topic_name){
            data.topic = req.params.topic_name;
            res.render('blogs/blog_topic',data);
        }else{
            res.redirect('/blogs');
        }
    });
    app.use('/blogs', router);
}
