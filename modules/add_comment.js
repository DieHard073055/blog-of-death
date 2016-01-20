var connect_db = require('./db_module').connect_db_write;
var objectID = require('./db_module').objectID;

// ======================================================================
// function to be exported which accepts the req.body and response object
// ======================================================================

var add_comments = function(data, res){
    var out ={};
    out['status'] = [];

    if(data.arguments== 'add_comment'){
        if(data.comment_text && data.blog_id){
            console.log('comment recieved!');
            if(data.blog_id.length >23){
                console.log('checking if blog exists');
                check_blog_id(data.blog_id, function(result){
                    if(result){
                        var comment = {
                            text:data.comment_text, 
                            blog_id:data.blog_id, 
                            author:'diehard', 
                            date: new Date().toDateString()
                        };
                        insert_comment(comment, function(result){
                            if(result) out.status.push('Successfully added the comment to the db');         
                            else out.status.push('Failed to add the comment to the db');
                            res.send(JSON.stringify(out));
                        });
                    }else{res.send(JSON.stringify(invalid_blog_id()));}
                });
            }else{res.send(JSON.stringify(invalid_blog_id()));}
        }else{res.send(JSON.stringify(missing_comment_text()));}
    }else{res.send(JSON.stringify(get_instructions()));}
};


// ============================================
// Check if the blog_id exists
// ============================================

var check_blog_id = function(blog_id, done){
    connect_db(function(err, db, callback){
        var called = false;
        if(err) throw err;
        cursor = db.collection('blogs').find({_id:objectID(blog_id)});
        cursor.each(
            function(err, doc){
                if(err) throw err;
                if(doc!=null){
                    console.log(doc);
                    if(doc._id == blog_id){
                       if(!called){called=true;callback();done(true);}
                    }else{
                        if(!called){called=true;callback();done(false);}
                    }
                }else{
                    if(!called){called=true;callback();done(false);}
                }
            }
        );
        
    });
};

// =====================================================
// use the connect_db module to insert the comment into db
// =====================================================

var insert_comment = function(comment, done){
     connect_db(function(err, db, callback){
        console.log('Inserting new comment into comment collection');
        db.collection('comments').insertOne(
            comment,
            function(err, result){
                if(err) throw err;
                console.log(JSON.stringify(result.result));
                callback();
                done(result.result.n);
            }
        );
    });
}

// =====================================================
// returns the instructions on how to use the module api
// =====================================================

var get_instructions = function(){
    var instructions = {
        'instructions' :
        'add_comments_module : to add a new comment to the comments collection, add the following data to the request body.  arguments :  add_comment, comment : "comment name"  '
    };
    return instructions;
};

// =========================================================
// returns error if the client forgot to send the comment name
// =========================================================

var missing_comment_text = function(){
    return {
        'error' : 'missing data - comment_text : <comment_text> , blog_id : <id of the blog the comment goes to>'
    };
};

var invalid_blog_id = function(){
    return {
        'error' : 'the blog_id provided does not exist, please provide a legit blog_id'
    };
};

module.exports = add_comments;
