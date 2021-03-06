var connect_db = require('./db_module').connect_db_read;
var objectID = require('./db_module').objectID;

// ==================
// function to export
// ==================

var blog = function(data, res){
    if(data.id){
        if(data.id.length > 23){
            var id =  objectID(data.id);
            fetch_blog_via_id(id, function(blog){
                res.send(JSON.stringify(blog));
            });
        }else{
            //ID too short
            res.send(JSON.stringify(id_too_short()));
        }
    }else{
        //instructions
        res.send(JSON.stringify(get_instructions));
    }
};


// ====================
// Fetch blog via id
// ==================

var fetch_blog_via_id = function(id, done){
    connect_db(function(err, db, callback){
        var data = null;
        var cursor = db.collection('blogs').find({_id:id});
        cursor.each(function(err, doc){
            if(err) throw err;
            if(doc != null){
                data = doc;
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
        'blog_module : to retrieve a blog from the blogs collection, add the following data to the request body. module : blog, id : "insert blog id"'
    };
};
module.exports = blog;
