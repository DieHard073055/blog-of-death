var connect_db = require('./db_module').connect_db_write;
var objectID = require('./db_module').objectID;

// ========================================
// function to be exported to delete topics
// ========================================

var delete_topics = function(data, res){
    var out = {}; 
    out['status'] = [];

    if(data.arguments == 'delete_topic'){
        if(data.id){
            //remove the topic
            var topic_id = objectID(data.id);
            remove_topic(topic_id, function(result){
                if(result){
                    out.status.push('Successfully deleted the topic');
                }else{
                    out.status.push('Sorry, we were not able to delete the topic');
                }
                res.send(out);
            });
        }else{
            //error id was not passed
            res.send(JSON.stringify(missing_topic_id()));
        }
    }else{
        res.send(JSON.stringify(get_instructions()));
    }
};

// =============================================================
// query the database to remove the topic with the id : topic_id
// =============================================================

var remove_topic = function(topic_id, done){
    connect_db(function(err, db, callback){
        db.collection('topics').deleteOne(
            {_id: topic_id},
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
// Missing topic id
// =================

var missing_topic_id = function(){
    return {
        'error' : 'missing data - id : "topic id"'
    };
};

// ===================
// return instructions
// ===================

var get_instructions = function(){
    var instructions = {
        'instructions' : 
        'delete_topic_module : to remove a topic from the topic list collection, add the following data to the request body. argument : delete_topic, topic_id : "topic_id"'
    };
    return instructions;
}

module.exports = delete_topics;
