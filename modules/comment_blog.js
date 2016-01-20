var connect_db = require('./db_module').connect_db_read;
var objectID = require('./db_module').objectID;

// ==================
// function to export
// ==================

var comment_blog = function(data, res){
    if(data.blog_id){
        if(data.blog_id.length > 23){
            var id = data.blog_id
            fetch_comments_via_blog_id(id, function(comments){
                res.send(JSON.stringify(comments));
            });
        }else{
            //ID too short
            res.send(JSON.stringify(id_too_short()));
        }
    }else{
        //instructions
        res.send(JSON.stringify(get_instructions()));
    }
};


// ====================
// Fetch blog via id
// ==================

var fetch_comments_via_blog_id = function(id, done){
    connect_db(function(err, db, callback){
        var data = [];
        var cursor = db.collection('comments').find({blog_id:id});
        cursor.each(function(err, doc){
            if(err) throw err;
            if(doc != null){
                data.push(doc);
            }else{
                callback();
                done(data);
            }
        });
    });
};
var id_too_short = function(){
    return{
        'error' : 'The id needs to be an id from the blogs database'
    };
};
var get_instructions = function(){
    return {
        'instructions' :
        'comment_blog_module : to retrieve a blog from the blogs collection, add the following data to the request body. module : blog, id : "insert blog id"'
    };
};
module.exports = comment_blog;
