/**
 * User: willerce
 * Date: 9/5/12
 * Time: 11:01 PM
 */

var db = require('../config.js').db;
var postCollection = db.collection('post');

exports.all = function(callback){
  postCollection.find().sort({created: -1}).toArray(function(err, result){
    callback(err,result)
  });
};


exports.findAll = function(skip, limit, callback){
  postCollection.find().sort({created: -1}).skip(skip).limit(limit).toArray(function(err, result){
    callback(err,result)
  });
}

exports.get = function(condition, callback){
  postCollection.find(condition).toArray(function(err, result) {
    if(!err)
      if(result.length==0)
        callback(err,null);
      else
        callback(err, result[0]);
  });
};

exports.insert = function(obj, callback){
  postCollection.insert( obj , function(err, result) {
    if(!err){
      callback(result);
    }
  });
};

exports.update = function(old_slug, post, callback) {
  postCollection.update({slug: old_slug}, {$set: post }, function(err, result){
    callback(err, result);
  })
};

exports.delete = function(slug, callback){

}

exports.count = function(callback){
  postCollection.count({}, function(err, count){
    callback(err, count);
  });
}
