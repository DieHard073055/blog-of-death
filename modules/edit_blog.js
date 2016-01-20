var connect_db = require('./db_module').connect_db_write;
var objectID = require('./db_module').objectID;

// =========================
// Function to be exported
// =======================

var edit_blog = function(data, res){
    var out = {}
    out.status = [];

    if(data.id){ 
        check_for_all_fields(data, function(fields){
            if(fields > 5){
                title_exists(data.title, data.id, function(result){
                    if(!result){
                        prep_payload(data, function(payload){
                            update_blog_entry(data.id, payload, function(result){
                                if(result){
                                    out.status.push('Successfully updated the blog');      

                                    res.send(out);
                                }else{
                                    out.status.push('Sorry! we were unable to updated the blog');      
                                    res.send(out);
                                }
                            });
                        });
                    }else{
                        //duplicate title error
                                    res.send(duplicate_title_error());
                    }
                });
            }else{
                //Please provide the required data
                                    res.send(get_instructions());
            }
        });
   }else{
        //Please provide the required data
                                    res.send(get_instructions());
   }
};


// ===============================================
// Function to check if all the fields are present
// ===============================================

var check_for_all_fields = function(data, done){
    var fields =0;
    var pageCount =0;

    if(data.title) fields++;
    if(data.topic) fields++;
    if(data.tags) fields++;
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

// ==========================================
// prep the payload to deploy to the database
// ==========================================

var prep_payload = function(data, done){
    var pages = []
    for(var i=0; i<data.page_num; i++){
        pages.push({
            subtitle : data['page_' + i + '_subtitle'],
            body : data['page_' + i + '_body'],
            date_modified : new Date().toDateString()
        });
    }
    var blog_update_entry = {
        title : data.title,
        topic : data.topic,
        tags : data.tags.split(' '),
        'pages' : pages
    };

    done(blog_update_entry);
};

// =========================
// check for duplicate title
// =========================


var title_exists = function(title, id, done){
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
                    if(doc.title == title && doc.id != id){
                    
                        if(!called){called=true;done(true)}
                    }else{
                        if(!called){called=true;done(false)}
                    }
                }else{
                    if(!called){called=true;done(false)}
                }
            }
        );
    });
}

// ============================
// update the collection
// =====================

var update_blog_entry = function(id, blog_update_entry, done){
    connect_db(function(err, db, callback){
        if(err) throw err;
        console.log('Updating blog_entry with id : ' + id);
        db.collection('blogs').updateOne(
            { _id : objectID(id) },
            { $set : blog_update_entry },
            function(err, results){
                if(err) throw err;
                console.log(results.result);
                callback();
                done(results.result.n);
            }
        );
    });
};

// ==========================
// Duplicate title error
// =====================

var duplicate_title_error = function(){
    return {
        'error' : 'Sorry, the provided title already exists! please provide a unique title!'
    };
};

var get_instructions = function(){
    return {
        'instructions' : 'In order to update a blog it is required to provide the following arguments :- module : edit_blog, id : "id of the blog to be edited", title : "old/new title", topic : "old/new topic", tags : "old/new tags", page_num:"number of pages being submited", page_x_subtitle : "subtitle of the page x : x starts with 0", page_x_body : "the body of the page x'
    };
};

module.exports=edit_blog;
