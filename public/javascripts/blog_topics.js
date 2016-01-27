
(function(main, $, undefined){
    var post_data_blogs = function(payload, callback){
        $.post('/blogs', payload, function(data){callback(data);}, 'json');
    };
    var htmlify = function(tag, text, info){
        info = info || ' ';
        return '<' + tag + ' '+ info + '>' + text + '</' + tag + '>';
    };


    $(document).ready(function(){
           var payload = {
                'module': 'blog_topic', 
                'topic' : $('#topic').val()
            };
            post_data_blogs(payload , function(data){
                console.log(data);
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

                    var d = document.createElement('div');
                    var dd = document.createElement('div');
                    var ddd = document.createElement('div');
                    $(ddd).addClass('container');
                    $(dd).addClass('container');
                    $(dd).addClass('well well-lg');
                    $(d).append($(title));
                    $(d).append($(author));
                    $(d).append($(topic));
                    $(d).append($(tags));
                    $(d).attr('data-href', '/blogs/show_blog/' + e._id);
                    //making the divs, user interactive
                    $(dd).hover(function(){
                        //Mouse Enter
                        $(this).removeClass('well well-lg');
                        $(this).addClass('panel panel-default');
                    }, function(){
                        //Mouse Leave
                        $(this).removeClass('panel panel-default');
                        $(this).addClass('well well-lg');
                    });
                    $(d).click(function(){
                        window.location = $(this).attr('data-href');
                        return false;
                    });
                    $(dd).append($(d));
                    $(ddd).append($(dd));
                    $('#blogs-list').append($(ddd));
                   
                });
            });

    });

}(window.main = window.main || {}, jQuery));
