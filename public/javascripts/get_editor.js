var get_editor = function(page_num){
var editor_code = encodeURI(`<!--EDITOR START--><div contentEditable="false" class="ewrapper`+page_num+`"><div class="toolbar"><div class="block"><a data-wysihtml5-command="bold" title="CTRL+B" class="btn btn-default btn-xs"> <span class="fa fa-bold"></span></a><a data-wysihtml5-command="italic" title="CTRL+I" class="btn btn-default btn-xs"> <span class="fa fa-italic"></span></a>
<a data-wysihtml5-command="underline" title="CTRL+U" class="btn btn-default btn-xs">
    <span class="fa fa-underline"></span></a>
<a data-wysihtml5-command="superscript" title="sup" class="btn btn-default btn-xs">
    <span class="fa fa-superscript"></span></a>
<a data-wysihtml5-command="subscript" title="sub" class="btn btn-default btn-xs">
    <span class="fa fa-subscript"></span></a>
<a data-wysihtml5-command="fontSizeStyle" class="btn btn-default btn-xs">
    <span class="fa fa-text-height"></span></a>

<div data-wysihtml5-dialog="fontSizeStyle" style="display: none;">Size : <div class="size">
<script type="text/javascript" charset="utf-8">
    var setSize`+page_num+` = function(size){
        document.getElementById("size-display-`+page_num+`").value = size + 'px';
    };
</script>
<input type="range" min="0" max="100" step="1" oninput="setSize`+page_num+`(this.value)"  onchange="setSize`+page_num+`(this.value)" style="width: 100px;">
<input id="size-display-`+page_num+`" type="text" data-wysihtml5-dialog-field="size" style="width: 60px;" value=""></div>

<a data-wysihtml5-dialog-action="save" class="btn btn-default btn-xs">OK</a>
<a data-wysihtml5-dialog-action="cancel" class="btn btn-default btn-xs">Cancel</a></div>
<a data-wysihtml5-command="createLink" class="btn btn-default btn-xs">
    <span class="fa fa-link"></span></a>
<a data-wysihtml5-command="removeLink" class="btn btn-default btn-xs">
    <span class="fa fa-unlink"></span></a>
<a data-wysihtml5-command="insertImage" class="btn btn-default btn-xs">
    <span class="fa fa-image"></span></a>
<a data-wysihtml5-command="formatBlock" data-wysihtml5-command-value="h1" class="btn btn-default btn-xs">
    h1</a>
<a data-wysihtml5-command="formatBlock" data-wysihtml5-command-value="h2" class="btn btn-default btn-xs">
    h2</a>
<a data-wysihtml5-command="formatBlock" data-wysihtml5-command-value="h3" class="btn btn-default btn-xs">
    h3</a>
<a data-wysihtml5-command="formatBlock" data-wysihtml5-command-value="p" class="btn btn-default btn-xs">
    h4</a>
<a data-wysihtml5-command="formatBlock" data-wysihtml5-command-value="pre" class="btn btn-default btn-xs">
    pre</a>
<a data-wysihtml5-command="formatBlock" data-wysihtml5-command-blank-value="true" class="btn btn-default btn-xs">
    plain</a>
<a data-wysihtml5-command="insertBlockQuote" class="btn btn-default btn-xs">
    <span class="fa fa-quote-left"></span></a>
<a data-wysihtml5-command="formatCode" data-wysihtml5-command-value="language-html" class="btn btn-default btn-xs">
    &lt; code &gt; </a>
<a data-wysihtml5-command="insertUnorderedList" class="btn btn-default btn-xs"> 
    <span class="fa fa-list-ul"></span></a>
<a data-wysihtml5-command="insertOrderedList" class="btn btn-default btn-xs">
    <span class="fa fa-list-ol"></span></a>
<a data-wysihtml5-command="outdentList" class="btn btn-default btn-xs">
    <span class="fa fa-arrow-left"></span></a>
<a data-wysihtml5-command="indentList" class="btn btn-default btn-xs">
    <span class="fa fa-arrow-right"></span></a>
<a data-wysihtml5-command="justifyLeft"></a>
<a data-wysihtml5-command="justifyRight"></a>
<a data-wysihtml5-command="justifyFull"></a>
<a data-wysihtml5-command="alignLeftStyle" class="btn btn-default btn-xs"> 
    <span class="fa fa-align-left"></span></a>
<a data-wysihtml5-command="alignCenterStyle" class="btn btn-default btn-xs"> 
    <span class="fa fa-align-center"></span></a>
<a data-wysihtml5-command="alignRightStyle" class="btn btn-default btn-xs"> 
    <span class="fa fa-align-right"></span></a>
<!--For Colors -->
<a data-wysihtml5-command="foreColorStyle" class="btn btn-default btn-xs"> 
    <span class="fa fa-eyedropper">Color</span></a>
<div data-wysihtml5-dialog="foreColorStyle" style="display: none;">
Color
<!--Color Picker START-->
<div class="color"><script type="text/javascript" src="/farbtastic/farbtastic.js"></script><link rel="stylesheet" href="/farbtastic/farbtastic.css" type="text/css"><script type="text/javascript" charset="utf-8">var hexToRgb = function(hex){
    var shorthandRegex = /^#?([a-f\\d])([a-f\\d])([a-f\\d])$/i;
    hex = hex.replace(shorthandRegex, function(m,r,g,b){
        return r + r + g + g + b + b;
    });

    var result = /^#?([a-f\\d]{2})([a-f\\d]{2})([a-f\\d]{2})$/i.exec(hex);
    return result ? {
        r : parseInt(result[1], 16),
        g : parseInt(result[2], 16),
        b : parseInt(result[3], 16)
    } : null;
};

var get_color = function(rgb){
    return 'rgb('+rgb.r+','+rgb.g+','+rgb.b+')';
};

$(document).ready(function() {

    $('#picker`+page_num+`').farbtastic(function(color){
        $('#color`+page_num+`').val(get_color(hexToRgb(color)));   
    });
});
</script>
<input type="text" data-wysihtml5-dialog-field="color" value="rgba(0,0,0,1)" id="color`+page_num+`">
<div id="picker`+page_num+`"></div>
<!--Color Picker END--><a data-wysihtml5-dialog-action="save" class="btn btn-default">OK</a>
<a data-wysihtml5-dialog-action="cancel" class="btn btn-default">Cancel</a></div>
</div>
<!--background Colors-->
<a data-wysihtml5-command="bgColorStyle" class="btn btn-default btn-xs"> <span class="fa fa-picture-o">BG Color</span></a>
<div data-wysihtml5-dialog="bgColorStyle" style="display: none;">Color:
<!--Color Picker START-->
<div class="color">
<script type="text/javascript" src="/farbtastic/farbtastic.js"></script>
<link rel="stylesheet" href="/farbtastic/farbtastic.css" type="text/css"><script type="text/javascript" charset="utf-8">
var hexToRgb = function(hex){
    var shorthandRegex = /^#?([a-f\\d])([a-f\\d])([a-f\\d])$/i;
    hex = hex.replace(shorthandRegex, function(m,r,g,b){
        return r + r + g + g + b + b;
    });

    var result = /^#?([a-f\\d]{2})([a-f\\d]{2})([a-f\\d]{2})$/i.exec(hex);
    return result ? {
        r : parseInt(result[1], 16),
        g : parseInt(result[2], 16),
        b : parseInt(result[3], 16)
    } : null;
};

var get_color = function(rgb){
    return 'rgb('+rgb.r+','+rgb.g+','+rgb.b+')';
};

$(document).ready(function() {
    $('#bgpicker`+page_num+`').farbtastic(function(color){
        $('#bgcolor`+page_num+`').val(get_color(hexToRgb(color)));   
    });
});
</script>
    <input type="text" data-wysihtml5-dialog-field="color" value="rgba(0,0,0,1)" id="bgcolor`+page_num+`">
    <div id="bgpicker`+page_num+`"></div>
    <!--Color Picker END-->
    </div>
    <a data-wysihtml5-dialog-action="save" class="btn btn-default btn-xs">OK</a>
    <a data-wysihtml5-dialog-action="cancel" class="btn btn-default btn-xs">Cancel</a></div>
    <a data-wysihtml5-command="undo" class="btn btn-default btn-xs"><span class="fa fa-undo">Undo</span></a>
    <a data-wysihtml5-command="redo" class="btn btn-default btn-xs"><span class="fa fa-level-up">Redo</span></a>
    <a data-wysihtml5-action="change_view" class="btn btn-default btn-xs"><span class="fa fa-terminal">HTML</span></a></div>
    <div data-wysihtml5-dialog="createLink" style="display: none;">
    <label>Link<input data-wysihtml5-dialog-field="href" value="http://"></label>
    <a data-wysihtml5-dialog-action="save" class="btn btn-default btn-xs">OK</a>
    <a data-wysihtml5-dialog-action="cancel" class="btn btn-default btn-xs">Cancel</a></div>
    <div div data-wysihtml5-dialog="insertImage" style="display: none;">
    <label>Image:<input data-wysihtml5-dialog-field="src" value="http://"></label>
    <label>Align:<select data-wysihtml5-dialog-field="className">
    <option value="">default</option>
    <option value="wysiwyg-float-left">Left</option>
    <option value="wysiwyg-float-right">Right</option></select></label>
    <a data-wysihtml5-dialog-action="save" class="btn btn-default btn-xs">OK</a>
    <a data-wysihtml5-dialog-action="cancel" class="btn btn-default btn-xs">Cancel</a></div></div>
    <label for="Body">Body</label>
    <br>
    <textarea placeholder="" name="page_`+page_num+`_body" id="page_`+page_num+`_body" class="bodytext editable`+page_num+`"></textarea>
    </div>
    <!--EDITOR END-->`);
return editor_code;
};