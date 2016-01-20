
var connect_db = require('./db_module').connect_db_write;
var objectID = require('./db_module').objectID;

// ========================================
// function to be exported to delete comments
// ========================================

var delete_comments = function(data, res){
    var out = {}; 
    out['status'] = [];

    if(data.arguments == 'delete_comment'){
        if(data.id){
            //remove the comment
            var comment_id = objectID(data.id);
            remove_comment(comment_id, function(result){
                if(result){
                    out.status.push('Successfully deleted the comment');
                }else{
                    out.status.push('Sorry, we were not able to delete the comment');
                }
                res.send(out);
            });
        }else{
            //error id was not passed
            res.send(JSON.stringify(missing_comment_id()));
        }
    }else{
        res.send(JSON.stringify(get_instructions()));
    }
};

// =============================================================
// query the database to remove the comment with the id : comment_id
// =============================================================

var remove_comment = function(comment_id, done){
    connect_db(function(err, db, callback){
        db.collection('comments').deleteOne(
            {_id: comment_id},
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
// Missing comment id
// =================

var missing_comment_id = function(){
    return {
        'error' : 'missing data - id : "comment id"'
    };
};

// ===================
// return instructions
// ===================

var get_instructions = function(){
    var instructions = {
        'instructions' : 
        'delete_comment_module : to remove a comment from the comment list collection, add the following data to the request body. argument : delete_comment, comment_id : "comment_id"'
    };
    return instructions;
}

module.exports = delete_comments;
