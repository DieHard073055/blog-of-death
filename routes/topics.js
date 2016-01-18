var express = require('express');
var router = express.Router();

/**************************************************************************************
 * REST API *
 ************
 * 
 * '/topics' - via post
 *
 *      -all_topics : Gives a list of all topics in the topics collection
 *      -add_topic : [topic] Adds a new topic to the collection
 *      -delete_topic : [id] Deletes the topic if does not exit in the blogs collection
 *
 ***************************************************************************************/

var request_modules = {
    'all_topics' : require('../modules/all_topics'),
    'add_topic' : require('../modules/add_topics'),
    'delete_topic' : require('../modules/delete_topics')
};

router.post('/', function(req, res, next){
    module = req.body.module;
    console.log('/topics | post | Recieved : ' + JSON.stringify(req.body));
    if(request_modules[module]) request_modules[module](req.body, res);
    else res.send(JSON.stringify(
        { 'error':'Requested module cannot be found' }
        )
    );

});

module.exports = router;
