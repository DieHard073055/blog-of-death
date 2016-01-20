var connect_db = require('./db_module').connect_db_read;

var all_comments = function(data, res){
    var args = data.arguments;
    
    if(args == 'all_comments'){
        //get list of all comments 
        //print a list of comments to the user

        //database operations
        fetch_all(function(comments){
            res.send(JSON.stringify(comments));
        });

    }else{
        //print instructions
       
        res.send(JSON.stringify(get_instructions()));
    }
};
// ================================
// fetch all data from the database
// ================================

var fetch_all = function(done){
    var comments = [];
    connect_db(function(err, db, callback){
        console.log('Request recieved to fetch all comments');
        var cursor = db.collection('comments').find();
        cursor.each(function(err, doc){
            if(err) throw err;
            if(doc!=null){
                comments.push(doc);    
            }else{
                callback();
                done(comments);
            }
        });
    });
};

// ==============================
// Get instructions for the api
// ==============================

var get_instructions = function(){
    var instructions = {
        'instructions' :
        'all_comments_module : to get a list of all comments, add the following data to the request body { arguments : all_comments }.'
    };
    return instructions;
};

module.exports = all_comments;
