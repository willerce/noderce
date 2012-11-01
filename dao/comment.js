/**
 * Created with JetBrains WebStorm.
 * User: willerce
 * Date: 11/1/12
 * Time: 8:57 PM
 * To change this template use File | Settings | File Templates.
 */

var db = require('../config.js').db;
db.bind('comment');

exports.insert = function(obj, callback){
  db.comment.insert(obj, function (err, result) {
      callback(err,result);
    }
  );
};

exports.findByPostid = function(post_id, callback){
  db.comment.find({post_id: post_id}).toArray(function (err, result) {
      callback(err,result);
    }
  );
};