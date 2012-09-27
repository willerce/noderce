/**
 * User: willerce
 * Date: 9/6/12
 * Time: 10:32 PM
 */

var db = require('../config.js').db;

var userCollection = db.collection('user');

exports.insert = function(user, callback){
  userCollection.insert(user ,function(err, result){
    console.log(result);
    callback(result);
    db.close();
  });
};

exports.findAll = function(obj, callback){
  userCollection.find(obj).toArray(function(err, result){
    callback(err, result);
  });
}

exports.get = function(name, callback){
  userCollection.find({name: name}).toArray(function(err, result){
    callback(err, result[0]);
  });
};