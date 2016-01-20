var connect_db = require('./db_module').connect_db_read;

// ==============================
// Function that will be exported
// ==============================

var all_blogs = function(data, res){
    if(data.arguments == 'all_blogs'){
        fetch_all(function(blogs){
            res.send(JSON.stringify(blogs));
        });
    }else{
        //Instructions
        res.send(JSON.stringify(get_instructions()));
    }
};

// ===============
// Fetch all blogs
// ===============

var fetch_all = function(done){
    var blogs = [];
    connect_db(function(err, db, callback){
        console.log('Request recieved to fetch all blogs');
        var cursor = db.collection('blogs').aggregate(
            [ {$project:{
                _id: 1,
                title: 1,
                author: 1,
                topic: 1,
                tags: 1
            }}]
        );
        cursor.each(function(err, doc){
            if(err) throw err;
            if(doc != null) blogs.push(doc);
            else{
                callback();
                done(blogs);
            }
        });
    });
};
// ================
// get instructions
// ================

var get_instructions = function(){
    return {
        'instructions' : 
        'all_blogs_module : to get a list of all the blogs, add the following data to the request body { arguments : all_blogs }.'
    };
};
module.exports = all_blogs;
