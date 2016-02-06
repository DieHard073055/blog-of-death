(function(main, $, undefined){
    
    var get_danger_alert = function(header, msg, redirect, redirect_msg){
        if(!redirect)
            var out = `
            <div class="alert alert-danger alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> 
            <h4>` + header + `</h4> <p>`+ msg + `</p>
            </div>`;
        else
            var out = `
            <div class="alert alert-danger alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> 
            <h4>` + header + `</h4> <p>`+ msg + `
            </p>
            <p><a href="`+redirect+`" class="btn btn-success"> `+redirect_msg+` </a></p>
            </div>`;
        return out;
    }
    var get_success_alert = function(header, msg, redirect, redirect_msg){
        if(!redirect)
            var out = `
            <div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> 
            <h4>` + header + `</h4> <p>`+ msg + `</p>
            </div>`;
        else
            var out = `
            <div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> 
            <h4>` + header + `</h4> <p>`+ msg + `
            </p>
            <p><a href="`+redirect+`" class="btn btn-success"> `+redirect_msg+` </a></p>
            </div>`;
        return out;
    }
    
    var post_data_blogs = function(payload, callback){
        $.post('/blogs', payload, function(data){callback(data);}, 'json');
    };
    var htmlify = function(tag, text, info){
        info = info || ' ';
        return '<' + tag + ' '+ info + '>' + text + '</' + tag + '>';
    };
    var deleteblog = function(id){
        var payload = {
            module : 'delete_blog',
            arguments : 'delete_blog',
            'id':id
        };
        var alert_dialog = null;
        post_data_blogs(payload, function(data){
            if(data){
                if(data.code){
                    alert_dialog = get_success_alert(
                        'Success',
                        data.message
                    );
                }else{
                     alert_dialog = get_danger_alert(
                        'Oh no!',
                        data.message
                    );
                }
                //Post it on the user view..
                $('#alert-messages').append(alert_dialog);
                $('#blogs-list').empty();
                fetch_data_and_fill();
            }
        });
    };
    var delete_button_handler = function(event){
        var id = $(event.target).attr('data');
        console.log('id : ' + id);
        deleteblog(id);
    };
    var fetch_data_and_fill=function(){
        post_data_blogs(
            {
                'module': 'all_blogs', 
                'arguments' : 'all_blogs'
            }, function(data){
                data.forEach(function(e, i){
                    //looping through all the blogs
                    //-- creating a div for each blog
                    console.log(JSON.stringify(e));  
                    var title = document.createElement('h3');
                    $(title).html(e.title);

                    var author = document.createElement('h5');
                    $(author).html('By : '+ e.author);

                    var topic = document.createElement('h5');
                    $(topic).html('Topic : ' + e.topic);

                    var tags = document.createElement('h5');
                    $(tags).html('Tags : ' + e.tags.join(', '));
                    
                    var view_blog = document.createElement('a');
                    $(view_blog).attr('href','/blogs/show_blog/'+e._id);
                    $(view_blog).addClass('btn btn-primary')    
                    $(view_blog).html('view');

                    var edit_blog = document.createElement('a');
                    $(edit_blog).attr('href','/blogs/edit_blog/' + e._id);
                    $(edit_blog).addClass('btn btn-warning');
                    $(edit_blog).html('edit');

                    var delete_blog = document.createElement('a');
                    $(delete_blog).attr('id', ''+e._id);
                    $(delete_blog).attr('data', e._id);
                    $(delete_blog).addClass('btn btn-danger');
                    $(delete_blog).html('delete');
                    $(delete_blog).click(delete_button_handler);


                    var d = document.createElement('div');
                    var dd = document.createElement('div');
                    var ddd = document.createElement('div');
                    $(ddd).addClass('container');
                    $(dd).addClass('post');
//                    $(dd).addClass('well well-sm');
                    $(d).append($(title));
                    $(d).append($(author));
                    $(d).append($(topic));
                    $(d).append($(tags));
                    $(d).append($(view_blog));
                    $(d).append($(edit_blog));
                    $(d).append($(delete_blog));
                    //making the divs, user interactive
//                    $(d).hover(function(){
//                        //Mouse Enter
//                        //$(this).removeClass('');
//                        $(this).addClass('active');
//                    }, function(){
//                        //Mouse Leave
//                        //$(this).removeClass('active');
//                        $(this).addClass('');
//                    });

                    $(dd).append($(d));
                    $(ddd).append($(dd));
                    $('#blogs-list').append($(ddd));
                   
                });
            });
    };
    $(document).ready(function(){
        fetch_data_and_fill();
    });

}(window.main = window.main || {}, jQuery));
