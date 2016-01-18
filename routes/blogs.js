var express = require('express');
var router = express.Router();

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
    'all_blogs' : 'all_blogs_module',
    'blog' : 'blog_module',
    'add_blog' : 'add_blog_module',
    'edit_blog' : 'edit_blog_module',
    'blog_topic' : 'blog_topic_module',
    'blog_tag' : 'blog_tag_module'
};
router.post('/',function(req, res, next){
    module = req.body.module;
    console.log('/blogs | post | Recieved : ' + JSON.stringify(req.body));
    if(request_modules[module]) res.send(request_modules[module]);
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
    res.send('Shows all the blogs');    
});
router.get('/show_blog/:id', function(req, res, next){
    res.send('Shows blog with id : ' + req.params.id);    
});
router.get('/create_blog', function(req, res, next){
    res.send('Create blog page, create amazing blogs');    
});
router.get('/edit_blog', function(req, res, next){
    res.send('Shows a list of blogs which you can delete, edit or view');    
});
router.get('/edit_blog/:id', function(req, res, next){
    res.send('Edit the blog with id : '+ req.params.id);   
});
module.exports = router;
