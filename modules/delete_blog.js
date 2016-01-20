var connect_db = require('./db_module').connect_db_write;
var objectID = require('./db_module').objectID;

// ========================================
// function to be exported to delete blog
// ========================================

var delete_blog = function(data, res){
    var out = {}; 
    out['status'] = [];

    if(data.arguments == 'delete_blog'){
        if(data.id){
            //remove the blog
            var blog_id = objectID(data.id);
            remove_blog(blog_id, function(result){
                if(result){
                    out.status.push('Successfully deleted the blog');
                }else{
                    out.status.push('Sorry, we were not able to delete the blog');
                }
                res.send(out);
            });
        }else{
            //error id was not passed
            res.send(JSON.stringify(missing_blog_id()));
        }
    }else{
        res.send(JSON.stringify(get_instructions()));
    }
};

// =============================================================
// query the database to remove the blog with the id : blog_id
// =============================================================

var remove_blog= function(blog_id, done){
    connect_db(function(err, db, callback){
        db.collection('blogs').deleteOne(
            {_id: blog_id},
            function(err, result){
                if(err) throw err;
                console.log(result.result);
                callback();
                if(result.result.n) done(true);
                else done(false);
            }
        );
    });
};

// =================
// Missing blog id
// =================

var missing_blog_id = function(){
    return {
        'error' : 'missing data - id : "blog id"'
    };
};

// ===================
// return instructions
// ===================

var get_instructions = function(){
    var instructions = {
        'instructions' : 
        'delete_blog_module : to remove a blog from the blog list collection, add the following data to the request body. argument : delete_blog, blog_id : "blog_id"'
    };
    return instructions;
}

module.exports = delete_blog;
