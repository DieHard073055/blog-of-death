var connect_db = require('./db_module').connect_db_write;

// ========================
// function to be exported 
// ========================

var add_blog = function(data, res){
    var out ={};
    out['status'] = [];
    check_for_all_fields(data, function(fields){
        if(fields > 5){
            out.status.push('Fileds count : ' + fields);
            var i=0;
            var pages = [];
            console.log('page count : ' + data.page_num);
            out.status.push('Page count : ' + data.page_num);
            for(i=0;i<data.page_num;i++){
                pages.push({
                  subtitle: data['page_'+i+'_subtitle'],
                  body:data['page_'+i+'_body'],
                  date_modified : new Date().toDateString()
                });
            }
            title_exists(data.title, function(result){
                if(!result){
                    topic_exists(data.topic, function(result){
                        if(result){
                            var blog_entry = {
                                title : data.title,
                                author : 'diehard',
                                topic : data.topic,
                                tags : data.tags.split(' '),
                                'pages' : pages

                            };
                            insert_blog_entry(blog_entry, function(result){
                                if(result){
                                    out.status.push('Successfully added a new entry to the blogs collection');
                                    res.send(JSON.stringify(out));
                                }else{
                                    out.status.push('Sorry we were unable to add a new entry to the blog');
                                    res.send(JSON.stringify(out));
                                }
                            });
                        }else{
                            out.status.push('Sorry we were unable to add a new entry because the topic does not exist');
                            res.send(JSON.stringify(out));
                        }
                    });
                }else{
                    out.status.push('Sorry we were unable to add a new entry to the blog, the title already exists');
                    res.send(JSON.stringify(out));
                }
            });
        }else
        // need to provide all the required data
        res.send(JSON.stringify(get_instructions()));
    });
};

// =========================================================
// function to check if all the required fields are provided
// =========================================================

var check_for_all_fields = function(data, done){
    var fields =0;
    var pageCount = 0;
    if(data.title)fields++;
    if(data.topic)fields++;
    if(data.tags)fields++;
    if(data.page_num){
        fields++;
        for(var i=0; i<data.page_num; i++){
            var c = fields;
            if(data['page_'+i+'_subtitle']) fields++;
            if(data['page_'+i+'_body']) fields++;
            c = fields-c;
            if(c>1)pageCount++;
        }
    }
    data.page_num = pageCount;
    done(fields);
};

// =================================
// Insert the blog entry into the db
// =================================

var insert_blog_entry = function(blog_entry, done){
    connect_db(function(err, db, callback){
        console.log('Inserting new blog_entry into the blogs collection');
        db.collection('blogs').insertOne(
            blog_entry,
            function(err, result){
                if(err) throw err;
                console.log(JSON.stringify(result.result));
                callback();
                done(result.result.n);
            }
        );
    });
};

// =========================
// check for duplicate title
// =========================

var title_exists = function(title, done){
    connect_db(function(err, db, callback){
        var called = false;
        if(err) throw err;
        cursor = db.collection('blogs').find({
            'title':title
        });
        cursor.each(
            function(err, doc){
                if(err) throw err;
                if(doc!=null){
                    
                    console.log(doc);
                    if(doc.title == title){
                        if(!called){called=true;callback();done(true)}
                    }else{
                        if(!called){called=true;callback();done(false)}
                    }
                }else{
                    if(!called){called=true;callback();done(false)}
                }
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

// =================================
// gets the instructions for the api
// =================================

var get_instructions = function(){
    return {
        'instructions' : 'In order to submit a new blog it is required to provide the following arguments:- module :add_blog, title:"title", topic:"topic", tags:"tags with spaces seperating them", page_num:"number of pages in the blog", page_x_subtitle : "subtitle of the page starts with 0", page_x_body : "body of the page, and again x starts with 0"'
    };
};
module.exports=add_blog;
