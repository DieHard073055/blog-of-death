var connect_db = require('./db_module').connect_db_read;

var blog_tag = function(data, res){
    if(data.tag){
        fetch_blog_via_tag(data.tag, function(blogs){
            if(blogs) res.send(JSON.stringify(blogs));
            else res.send(JSON.stringify(tag_dosent_exist()));
        });
    }else{
        //instructions
        res.send(get_instructions());
    }
};
// ====================================
// Fetch all blogs with the given tag
// ====================================
var fetch_blog_via_tag = function(tag, done){
    connect_db(function(err, db, callback){
        var data = [];
        cursor = db.collection('blogs').find({'tags':tag},{
                _id:1, 
                title:1, 
                author:1, 
                topic:1, 
                tags:1
        });
        cursor.each(function(err, doc){
            if(err) throw err;
            if(doc != null)data.push(doc);
            else{
                callback();
                done(data);
            }
        });
    });
};
// ========================
// error tag dosent exist
// ========================

var tag_dosent_exist = function(){
    return {
        'error' : 'Sorry the requested tag does not exist'
    };
};

// ==================
// print instructions
// ==================
var get_instructions = function(){
    return {
        'instructions': 'In order to get all the blogs under a tag it is required to provide the following arguments :- module : blog_tag, tag : "name of the tag"'
    }
};

module.exports=blog_tag;
