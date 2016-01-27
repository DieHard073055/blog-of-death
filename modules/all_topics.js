var connect_db = require('./db_module').connect_db_read;

var all_topics = function(data, res){
    var args = data.arguments;
    
    if(args == 'all_topics'){
        //get list of all topics 
        //print a list of topics to the user

        //database operations
        fetch_all(function(topics){
            console.log(JSON.stringify(topics));
            res.send(JSON.stringify(topics));
            
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
    var topics = [];
    connect_db(function(err, db, callback){
        console.log('Request recieved to fetch all topics');
        var cursor = db.collection('topics').find();
        cursor.each(function(err, doc){
            if(err) throw err;
            if(doc!=null){
                topics.push(doc);    
            }else{
                callback();
                done(topics);
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
        'all_topics_module : to get a list of all topics, add the following data to the request body { arguments : all_topics }.'
    };
    return instructions;
};

module.exports = all_topics;
