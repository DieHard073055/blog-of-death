var connect_db = require('./db_module').connect_db_write;

// ======================================================================
// function to be exported which accepts the req.body and response object
// ======================================================================

var add_topics = function(data, res){
    var out ={};
    out['status'] = [];

    if(data.arguments== 'add_topic'){
        if(data.topic_name){
            if(!data.topic_parent) data.topic_parent = null;   
            console.log('topic name recieved!');
            topic_exists(data.topic_name, function(result){
                console.log("topic result : " + result)
                if(!result){
                    var topic = {topic_name:data.topic_name, topic_parent:data.topic_parent};
                    insert_topic(topic, function(result){
                        if(result) out.status.push('Successfully added the topic to the db');         
                        else out.status.push('Failed to add the topic to the db');
                        res.send(JSON.stringify(out));
                    });
                }else{
                    //topic already exists in topics collection
                    res.send(JSON.stringify(topic_already_exists()));
                }
            });
        }else{
            res.send(JSON.stringify(missing_topic_name()));
        }
    }else{
        res.send(JSON.stringify(get_instructions()));
    }
};

// =====================================================
// use the connect_db module to insert the topic into db
// =====================================================

var insert_topic = function(topic, done){
     connect_db(function(err, db, callback){
        console.log('Inserting new topic into topic collection');
        db.collection('topics').insertOne(
            topic,
            function(err, result){
                if(err) throw err;
                console.log(JSON.stringify(result.result));
                callback();
                done(result.result.n);
            }
        );
    });
}
// ============================================
// Check if the topic with the same name exists
// ============================================

var topic_exists = function(topic_name, done){
    connect_db(function(err, db, callback){
        var called = false;
        if(err) throw err;
        cursor = db.collection('topics').find({'topic_name':topic_name});
        cursor.each(
            function(err, doc){
                if(err) throw err;
                if(doc!=null){
                    console.log(doc);
                    if(doc.topic_name == topic_name){
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

var topic_already_exists = function(){
    return {
        'error' : 'Sorry we were unable to add the topic to the database as its already there'
    };
};

// =====================================================
// returns the instructions on how to use the module api
// =====================================================

var get_instructions = function(){
    var instructions = {
        'instructions' :
        'add_topics_module : to add a new topic to the topics collection, add the following data to the request body.  arguments :  add_topic, topic : "topic name"  '
    };
    return instructions;
};

// =========================================================
// returns error if the client forgot to send the topic name
// =========================================================

var missing_topic_name = function(){
    return {
        'error' : 'missing data - topic_name : <topic_name>'
    };
};

module.exports = add_topics;
