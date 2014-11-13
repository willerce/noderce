/**
 * User: willerce
 * Date: 11/1/12
 * Time: 8:57 PM
 */

var mongoskin = require('mongoskin');

var db = require('../config.js').db;
db.bind('comment');

exports.all = function (condition, limit, callback) {
  db.comment.find(condition).limit(limit).sort({created: -1, _id: -1}).toArray(function (err, result) {
    callback(err, result);
  });
};

exports.insert = function (obj, callback) {
  db.comment.insert(obj, function (err, result) {
    callback(err, result);
  });
};

exports.findByPostId = function (post_id, callback) {
  db.comment.find({post_id: post_id, status: {$ne: "0"}}).sort({created: 1}).toArray(function (err, result) {
    callback(err, result);
  });
};

exports.findOne = function (id, callback) {
  db.comment.findOne({_id: mongoskin.helper.toObjectID(id)}, function (err, result) {
    callback(err, result);
  });
};

exports.save = function (obj, callback) {
  db.comment.save(obj, function (err, result) {
    callback(err, result);
  })
};

exports.deleteById = function (id, callback) {
  db.comment.remove({_id: mongoskin.helper.toObjectID(id)}, function (err, result) {
    callback(err, result);
  })
};

exports.updateAvater = function (id, avater, callback) {
  db.comment.update({_id: mongoskin.helper.toObjectID(id)}, {$set: {avatar:avater} }, function (err, result) {
    callback(err, result);
  })
};