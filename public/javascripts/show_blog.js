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
    var post_data_comments = function(payload, callback){
        $.post('/comments', payload, function(data){callback(data);},'json');
    };
    var htmlify = function(tag, text, info){
        info = info || ' ';
        return '<' + tag + ' '+ info + '>' + text + '</' + tag + '>';
    };
    var fill_up_data = function(data){
        $('#title').html(data.title);
        $('#author').html(data.author);
        $('#tags').html(data.tags.join(', '));
        $('#topic').html(data.topic);
        $('#data').html(data.date);
    };
    var submit_comment = function(){
        if($('#add-comment').val()){
            var payload = {
                'module' : 'add_comment',
                'arguments' : 'add_comment',
                'comment_text' : $('#add-comment').val(),
                'blog_id': $('#blog-id').val()
            };
            console.log(JSON.stringify(payload));
            post_data_comments(payload, function(data){
                $('#add-comment').val('');
                if(data.code){
                    $('#alerts').append(get_success_alert(
                        'Comment Success',
                        data.message
                        ));
                }else{
                    $('#alerts').append(get_danger_alert(
                        'WOoops, we have a problem!',
                        data.message
                        ));
                }
                load_all_comments();
            });
        }
    };
    var get_form_group = function(){
        formgroup = document.createElement('div');
        $(formgroup).addClass('form-group');
        return formgroup;
    }
    var setup_comments_controller = function(){
        if($('#user-id').val()){
            add_comment_div = document.createElement('div');
            add_comment_div_body = document.createElement('div');
            add_comment_name = document.createElement('label');
            add_comment_img = document.createElement('img');
            add_comment_text = document.createElement('textarea');

            $(add_comment_div).addClass('panel panel-primary form-group');
            $(add_comment_div_body).addClass('panel-body');
            $(add_comment_name).addClass('label label-primary');
            $(add_comment_name).html($('#user-name').val());
            $(add_comment_img).attr('src', '//graph.facebook.com/'+
                $('#user-id').val()+
                '/picture?type=square');
            $(add_comment_text).attr('row', 3);
            $(add_comment_text).addClass('form-control');
            $(add_comment_text).attr('id', 'add-comment');
            $(add_comment_text).keydown(function(event){
                if(event.keyCode == 13){
                  submit_comment();  
                }
            });

            add_comment_body = get_form_group();
            $(add_comment_body).addClass('form-inline');
            
            $(add_comment_div_body).append($(get_form_group()).html($(add_comment_name)));
            $(add_comment_body).append($(get_form_group()).html($(add_comment_img)));
            $(add_comment_body).append($(add_comment_text));
            $(add_comment_div_body).append($(add_comment_body));
            $(add_comment_div).append($(add_comment_div_body));
            $('#comments-comment').append($(add_comment_div));

        }
       load_all_comments(); 
        
    };
    var load_all_comments=function(){
        $('#comments').empty();
        //Load all the comments for the blog
        var payload = {
            'module':'comment_blog',
            'blog_id' : $('#blog-id').val()
        };
        post_data_comments(payload, function(data){
            console.log(data);
            data.forEach(function(e){
                main_div = document.createElement('div');
                label_div = document.createElement('div');
                img_div = document.createElement('div');

                name_label = document.createElement('label');
                $(name_label).addClass('label label-primary');
                $(name_label).html(e.author);

                img = document.createElement('img');
                $(img).attr('src',
                    '//graph.facebook.com/'+e.user_id+'/picture?type=square'
                );

                p = document.createElement('h4');
                $(p).html(e.text);

                date = document.createElement('p');
                $(date).html(e.date);

                $(img_div).addClass('form-inline');
                $(img_div).append($(get_form_group()).html($(img)));
                $(img_div).append($(get_form_group()).html($(p)));

                $(label_div).addClass('form-group');
                $(label_div).append($(name_label));

                $(main_div).addClass('well form-group');
                $(main_div).append($(label_div));
                $(main_div).append($(img_div));
                $(main_div).append($(date));

                $('#comments').append($(main_div));

            });
        });
    }
    var create_pages = function(pages){
        var page_nav = document.createElement('nav');

        if(pages.length > 1){
            var page_nav_ul = document.createElement('ul');
            $(page_nav_ul).addClass('pagination');
            for(var i=0; i<pages.length; i++){
                var li = document.createElement('li');
                var a = document.createElement('a');
                if(i==0) $(li).addClass('active');
                $(a).attr('href','#page_'+i);
                $(a).attr('data-toggle','tab');
                $(a).html(i+1);
                $(li).append($(a));
                $(page_nav_ul).append($(li));
            }
            $(page_nav).append($(page_nav_ul));
            $('#pages').append($(page_nav));

        }
        var pages_div = document.createElement('div');
        $(pages_div).addClass('tab-content');

        for(var i=0; i<pages.length; i++){
            var div = document.createElement('div');
            var stitle = document.createElement('h3');
            var body = document.createElement('div');
            var date = document.createElement('p');
            var space = document.createElement('br');
            var line = document.createElement('hr');
            
            $(div).attr('id', 'page_'+i);
            if(i==0)
                $(div).addClass('tab-pane fade in active');
            $(div).addClass('tab-pane fade');
            $(stitle).html(pages[i].subtitle);
            $(body).html(pages[i].body);
            $(date).html(pages[i].date_modified);

            $(div).append($(date));
            $(div).append($(stitle));
            $(div).append($(body));
            $(div).append($(space));
//            $(div).append($(line));

            $(pages_div).append($(div));
        }
        $('#pages').append($(pages_div));
    };

    $(document).ready(function(){
        post_data_blogs(
            {
                'module': 'blog', 
                'id' : $('#blog-id').val()
            }, function(data){
                console.log(data);  
                fill_up_data(data);
                create_pages(data.pages);
            });
        setup_comments_controller();

    });

}(window.main = window.main || {}, jQuery));
