var mongodb = require('mongodb');
var monClient = mongodb.MongoClient;
var objectID = mongodb.ObjectID;
var dbConfig = require('../config/database');
var writer = dbConfig.write_url;
var reader = dbConfig.read_url;

var connect_database_write = function(callback){
    monClient.connect(writer, function(err, db){
        if(err) callback(err, null, null);
        else{
            callback(null, db, function(){
                db.close(); 
            });
        }
    });
};

var connect_database_read = function(callback){
    monClient.connect(reader, function(err, db){
        if(err) callback(err, null, null);
        else{
            callback(null, db, function(){
                db.close();
            });
        }
    });
};
module.exports.connect_db_write = connect_database_write;
module.exports.connect_db_read = connect_database_read;
module.exports.objectID = objectID;
