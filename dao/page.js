/**
 * User: willerce
 * Date: 9/8/12
 * Time: 5:51 PM
 */

var db = require('../config.js').db;
var pageCollection = db.collection('page');

exports.all = function(callback){
  pageCollection.find().sort({created: -1}).toArray(function(err, result){
    callback(err,result)
  });
};

exports.get = function(condition, callback){
  pageCollection.find(condition).toArray(function(err, result) {
    if(!err)
      if(result.length==0)
        callback(err,null);
      else
        callback(err, result[0]);
  });
};

exports.insert = function(obj, callback){
  pageCollection.insert( obj , function(err, result) {
    if(!err){
      callback(result);
    }
  });
};

exports.update = function(old_slug, page, callback) {
  pageCollection.update({slug: old_slug}, {$set: page }, function(err, result){
    callback(err, result);
  })
};