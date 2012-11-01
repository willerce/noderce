/**
 * User: willerce
 * Date: 9/8/12
 * Time: 5:51 PM
 */

var db = require('../config.js').db;
db.bind('page');

exports.all = function(callback){
  db.page.find().sort({created: -1}).toArray(function(err, result){
    callback(err,result)
  });
};

exports.get = function(condition, callback){
  db.page.findOne(condition,function(err, result) {
    callback(err,result);
  });
};

exports.insert = function(obj, callback){
  db.page.insert( obj , function(err, result) {
    if(!err){
      callback(result);
    }
  });
};

exports.update = function(old_slug, page, callback) {
  db.page.update({slug: old_slug}, {$set: page }, function(err, result){
    callback(err, result);
  })
};