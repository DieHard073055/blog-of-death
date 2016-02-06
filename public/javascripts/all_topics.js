(function(main, $, undefined){

    var post_data_topics = function(payload, callback){
        $.post('/topics', payload, function(data){callback(data);}, 'json');
    };

    var post_data_blogs = function(payload, callback){
        $.post('/blogs', payload, function(data){callback(data);}, 'json');
    };
    var htify= function(tag, text, info){
        info = info || ' ';
        return '<' + tag + ' ' + info + '>' + text + '</' + tag + '>\n';
    };
    var get_null_parent=function(data){
        for(var i=0;i<data.length;i++){
            if(null==data[i].topic_parent){
                return i;
            }
        }

        return -1;
    };
    var get_child = function(p, data){
        for(var i=0; i<data.length; i++){
            if(data[i].topic_parent == p.topic_name){
                return i;
            }
        }

        return -1;
    };
    var get_all_children = function(p, data){
        var children = [];
        while(get_child(p, data) != -1){
            var child = data[get_child(p, data)];
            children.push(child);
            data.splice(get_child(p, data), 1);
        }
        return children;
    };
    var topics_out='';
    var recursive_child_search = function(p, data, num, callback){
        children = get_all_children(p, data);
        if(children.length > 0) {

            children.forEach(function(c, i, a){
                var space='&nbsp;&nbsp;&nbsp;&nbsp;';
                var bar = '|_____';
                for(var i=0;i<num;i++)space+=space;
                console.log(space+c.topic_name);
                var t = htify('a', c.topic_name, ' class="btn btn-default" href="/blogs/blog_topic/'+c.topic_name+'"');
                topics_out += htify('p',space+bar+t);
                recursive_child_search(c, data, ++num, function(){
                    if(i == a.length-1){
                        callback();
                    }
                });
            });
        }else{
            callback();
        }
    };
    var fill_up_topics = function(data){
        var ul = '';
        while(data.length){        
            p_i = get_null_parent(data);
            p = data[p_i];

            recursive_child_search(p, data, 1, function(){
                console.log(p.topic_name);
                var t = htify('a', p.topic_name, 'class="label label-primary" href="/blogs/blog_topic/'+p.topic_name+'"');
                t = htify('h3', t);
                topics_out += htify('p',t);
                topics_out = htify('div', topics_out, 'class="post"');
                ul += topics_out;
                topics_out = '';
                data.splice(p_i, 1);
                if(!data.length){
                    $('#blogs-list').html((ul));
                }

            });
        } 
    };
    var get_all_topics=function(){
        var payload = {
                module : 'all_topics',
                arguments : 'all_topics'
            };
        post_data_topics(payload, function(data){
            fill_up_topics(data);
        });
    }
    $(document).ready(function(){
        get_all_topics();
    });
}(window.main = window.main || {}, jQuery));
