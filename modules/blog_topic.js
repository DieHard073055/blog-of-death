var connect_db = require('./db_module').connect_db_read;

var blog_topic = function(data, res){
    if(data.topic){
        check_topic_exist(data.topic, function(result){
            if(result){
                fetch_blog_via_topic(data.topic, function(blogs){
                    res.send(JSON.stringify(blogs));
                });
            }else{
                //sorry topic dosent exist
                res.send(topic_dosent_exist());
            }
        });
    }else{
        //instructions
        res.send(get_instructions());
    }
};

// ==============
// check if topic exist
// ====================
var check_topic_exist = function(topic, done){
    var called=false;
    connect_db(function(err, db, callback){
        if(err) throw err;
        var cursor = db.collection('topics').find({topic_name : topic});
        cursor.each(function(err, doc){
            if(err) throw err;
            if(doc!= null){
                console.log(doc);
                if(doc.topic_name == topic){
                    if(!called){console.log('topic exists');called=true;callback();done(true);}
                }else if(!called){console.log('no topic found');called=true;callback();done(false);}
            }else{
                if(!called){
                    called=true;
                    console.log('nothing found');
                    callback();
                    done(false);
                }
            }

        });
    });
};
// ====================================
// Fetch all blogs with the given topic
// ====================================
var fetch_blog_via_topic = function(topic, done){
    connect_db(function(err, db, callback){
        var data = [];
        cursor = db.collection('blogs').find({'topic':topic},{
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
// error topic dosent exist
// ========================

var topic_dosent_exist = function(){
    return {
        'error' : 'Sorry the requested topic does not exist'
    };
};

// ==================
// print instructions
// ==================
var get_instructions = function(){
    return {
        'instructions': 'In order to get all the blogs under a topic it is required to provide the following arguments :- module : blog_topic, topic : "name of the topic"'
    }
};

module.exports=blog_topic;
