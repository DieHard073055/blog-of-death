

(function (main, $, undefined) {
    
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
    
    var post_data_topics = function(payload, callback){
        $.post( "/topics", 
                payload, 
                function( data ) {
                    callback(data);
                }, "json");
    };
    var post_data_blogs = function(payload, callback){
        $.post( "/blogs", 
                payload, 
                function( data ) {
                    callback(data);
                }, "json");
    };
    var populate_topics = function(topics){
        var topic_list_element = document.getElementById("populate_topics");
        var topic_list_element_modal = document.getElementById("populate_topics_modal");
        var modal_select = document.createElement("option");
        
        topic_list_element.options.length = 0;
        topic_list_element_modal.options.length = 0;
        
        modal_select.text = "none"
        topic_list_element_modal.add(modal_select);
        topics.forEach(function(e, i){
            var option = document.createElement("option");
            option.text =  e.topic_name;
            topic_list_element.add(option);
        });
        topics.forEach(function(e, i){
            var option = document.createElement("option");
            option.text =  e.topic_name;
            topic_list_element_modal.add(option);
        });
    };
    var htmlify = function(tag, text, info){
        info = info || ' ';
        return '<'+tag + ' ' + info + '>' + text + '</' + tag + '>';
    }
    var prevent_form_submit = function(){
        $(window).keydown(function(event){
            if(event.keyCode == 13) {
            event.preventDefault();
            return false;
            }
        });  
    };
    var update_topics_on_form = function(){
        post_data_topics(
        { module: "all_topics", arguments: "all_topics" },
        populate_topics
        );
    };
    var submit_form = function(){
      var $form = $(this);
            
            var num_pages = $('#page-content-nav').attr('data');
            
            var out = {};
            out['module'] = 'add_blog';
            out['title'] = $('#blog-title').val();
            out['tags'] = $('#blog-tags').val();
            out['topic'] = $('#populate_topics').find(":selected").text();
            out['page_num'] = num_pages;
            for(var i=0; i<num_pages; i++){
                out['page_'+i+'_subtitle'] = $('#page_'+i+'_subtitle').val();
                out['page_'+i+'_body'] = $('#page_'+i+'_body').html();
            }
            console.log(JSON.stringify(out));
            if(validate_form_data(out)){
                
                post_data_blogs(out, function(response){
                    console.log('response : ');
                    console.log(JSON.stringify(response));
                    if(response.code){
                        $('#alert_messages').append(get_success_alert(
                        'Success',//header
                        response.message,//message
                        '/blogs',
                        'wanna check it out?!'
                        ));
                    }else{
                        $('#alert_messages').append(get_danger_alert(
                        'Oops! You have an error',//header
                        response.message//message
                        ));
                    }
                });
            }else{
                $('#alert_messages').append(get_danger_alert(
                    'Oops! You have an error',//header
                    'Please fill in all the input boxes'//message
                ));
            }   
    }
    var validate_form_data= function(data){
        var all_good = true;
        //title
        if(data['title'] && data['tags'])
            for(var i=0; i<data['page_num']; i++){
                if(!(data['page_'+i+'_subtitle'] && data['page_'+i+'_body']))
                    all_good = false;
            }
        return all_good;
    }
    var remove_page = function(i){
        console.log('remove page : ' + i);
        if(i > 0){
            $('#page-content-nav').empty();
            $('#page-content-nav').attr('data', i);
            delete editors['editor'+i];
            $('div[id=page_'+i+']').remove();
            
            page_nav_handler();
        }
    };
    var add_page = function(i){
        console.log('add page : ' + i);
        if((i < 101)){
            $('#page-content-nav').empty();
            $('#page-content-nav').attr('data', i);
            page_nav_handler();
        
        //Create all the elements to add to the page
            i=i-1;
            div = document.createElement('div');
            //h = document.createElement('h3');
            div_2 = document.createElement('div');
            label = document.createElement('label');
            input = document.createElement('input');
            body = get_editor(i);
            //console.log(body);
            
            $(div).attr('id', 'page_'+i);
            $(div).addClass('tab-pane fade');
            $(div_2).addClass('form-group');
            $(label).attr('for', 'Title');
            $(label).html('Sub Title');
            $(input).attr('name', 'page_'+i+'_subtitle');
            $(input).attr('id', 'page_'+i+'_subtitle');
            $(input).addClass('form-control');
            
            $(div_2).append($(label));
            $(div_2).append($(input));
            
            $(div).append($(div_2));
            $(div).append($(decodeURI(body)));
            $('#page-content').append($(div));
            
            //Editor functions that needs to be included
            var editors = [];
            $('.ewrapper'+i).each(function(idx, wrapper) {
                var e = new wysihtml5.Editor($(wrapper).find('.editable'+i).get(0), {
                    toolbar:        $(wrapper).find('.toolbar').get(0),
                    parserRules:    wysihtml5ParserRules,
                    pasteParserRulesets: wysihtml5ParserPasteRulesets,
                    showToolbarAfterInit: false
                
                });
                editors.push(e);
                
                    
                e.on("showSource", function() {
                    alert(e.getValue(true));
                });
                    
            });
        }
    };
    var page_nav_handler = function(){
            num_pages = $('#page-content-nav').attr('data');
            if(num_pages == 1){
                var li = document.createElement('li');
                var a = document.createElement('a');
                var span = document.createElement('span');
                
                $(a).click(function(){
                    num = $('#page-content-nav').attr('data');
                    add_page(++num);
                });
                $(a).attr('id', 'add_page');
                $(a).addClass('btn btn-primary btn-xs');
                
                $(span).addClass('fa fa-plus');
                
                $(a).append($(span));
                $(li).append($(a));
                $('#page-content-nav').append($(li));
            }else if(num_pages > 1){
                
                for(var i=0; i<num_pages; i++){
                        var li = document.createElement('li');
                        var a = document.createElement('a');
                        $(a).attr('href','#page_'+(i));
                        $(a).attr('data-toggle', 'tab');
                        $(a).html('Page '+(i+1));
                        $(li).append($(a));
                        
                        if(i==0){
                            $(li).addClass('active');
                        }
                        $('#page-content-nav').append($(li));
                        
                        if(i==num_pages-1){
                            var li_p = document.createElement('li');
                            var a_p = document.createElement('a');
                            var span_p = document.createElement('span');
                            var li_m = document.createElement('li');
                            var a_m = document.createElement('a');
                            var span_m = document.createElement('span');
                            
                            //$(a_p).attr('href','add_page');
                            $(a_p).attr('id', 'add_page');
                            $(a_p).addClass('btn btn-primary btn-xs');
                            //$(a_m).attr('href','remove_page');
                            $(a_m).attr('id', 'remove_page');
                            $(a_m).addClass('btn btn-primary btn-xs');
                            
                            $(span_m).addClass('fa fa-minus');
                            $(span_p).addClass('fa fa-plus');
                            
                            $(a_p).append($(span_p));
                            $(li_p).append($(a_p));
                            $(a_m).append($(span_m));
                            $(li_m).append($(a_m));
                            $(a_p).click(function(){
                                num = $('#page-content-nav').attr('data');
                                add_page(++num);
                            });
                            $(a_m).click(function(){
                                num = $('#page-content-nav').attr('data');
                                remove_page(--num);
                            });
                            //This is buggy so has been disabled
                            //$('#page-content-nav').append($(li_m));
                            $('#page-content-nav').append($(li_p));
                        }
                        
            console.log('1');
                }
                
            }
            return num_pages;
    };
    var page_handler = function(num_pages){
        for(var i=0; i<num_pages; i++){
                div = document.createElement('div');
                //h = document.createElement('h3');
                div_2 = document.createElement('div');
                label = document.createElement('label');
                input = document.createElement('input');
                body = get_editor(i);
                //console.log(body);
                
                $(div).attr('id', 'page_'+i);
                $(div).addClass('tab-pane fade');
                if(i==0)$(div).addClass('in active');
                //$(h).html('Page '+(i+1));
                $(div_2).addClass('form-group');
                $(label).attr('for', 'Title');
                $(label).html('Sub Title');
                $(input).attr('name', 'page_'+i+'_subtitle');
                $(input).attr('id', 'page_'+i+'_subtitle');
                $(input).addClass('form-control');
                
                $(div_2).append($(label));
                $(div_2).append($(input));
                //if(num_pages > 1) $(div).append($(h));
                //$(div).append($(p));
                
                $(div).append($(div_2));
                $(div).append($(decodeURI(body)));
                $('#page-content').append($(div));
                
                //Editor functions that needs to be included
                var editors =  [];
                $('.ewrapper'+i).each(function(idx, wrapper) {
                    var e = new wysihtml5.Editor($(wrapper).find('.editable'+i).get(0), {
                        toolbar:        $(wrapper).find('.toolbar').get(0),
                        parserRules:    wysihtml5ParserRules,
                        pasteParserRulesets: wysihtml5ParserPasteRulesets,
                        showToolbarAfterInit: false
                    
                    });
                    editors.push(e);
                    
                        
                    e.on("showSource", function() {
                        //alert(e.getValue(true));
                    });
                        
                });
                
        }
         
    };
    //imediately executed
    prevent_form_submit();
    update_topics_on_form();
    $(document).ready(function(){
            num_pages = page_nav_handler();
            page_handler(num_pages);
            //Submit form
            $('#create-blog').submit(function(event){
                event.preventDefault();
                submit_form();            
            });
            
            $('#input_new_topic').bind("new_topic_selected", function(){
                $('#selected_topic').text($('#input_new_topic').val());
                $('#topic_parent_select').modal('show');
            });
            $('#input_new_topic').keyup(function(e){ if(e.keyCode==13) $(this).trigger("new_topic_selected");});
            $('#submit_topic').click(function(){
                var payload = {};
                payload['module'] = 'add_topic';
                payload['arguments'] = 'add_topic';
                payload['topic_parent'] = $('#populate_topics_modal').find(':selected').text();
                if(payload.topic_parent == 'none') delete payload.topic_parent;
                payload['topic_name'] =  $('#selected_topic').text();
                $('#topic_parent_select').modal('toggle');
                console.log(JSON.stringify(payload));
                post_data_topics(payload, function(response){
                    if(response.code){
                        $('#alert_messages').append(get_success_alert(
                        'Success',//header
                        response.message//message
                        ));
                    }else{
                        $('#alert_messages').append(get_danger_alert(
                        'Oops! You have an error',//header
                        response.message//message
                        ));
                    }
                    update_topics_on_form();
                });
                
            });
    });
    
  

    
    
}(window.main = window.main || {}, jQuery));
