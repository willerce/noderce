/*
 * Archive的DAO
 * Date: 2014-11-18
 */

var db = require('../config.js').db;
var postDBModel = require('../models/post.js');
var postArchiveModel = new postDBModel.Schema('postArchive');
db.bind('postArchive').bind(postArchiveModel);

exports.all = function (callback) {
  db.postArchive.find({}, {"content": 0}).sort({_id: -1}).toArray(function (err, result) {
    callback(err, result)
  });
};

exports.findAll = function (skip, limit, callback) {
  db.postArchive.find().sort({_id: -1}).skip(skip).limit(limit).toArray(function (err, result) {
    callback(err, result)
  });
};

exports.get = function (condition, callback) {
  db.postArchive.findOne(condition, function (err, result) {
    callback(null, result);
  });
};

exports.insert = function (obj, callback) {
  db.postArchive.insert(obj, function (err, result) {
    callback(err, null);
  });
};

exports.update = function (old_name, archive, callback) {
  db.postArchive.update({archiveName: old_name}, {$set: archive }, function (err, result) {
    callback(err, result);
  })
};

exports.delete = function (slug, callback) {

};

exports.count = function (condition, callback) {
  db.postArchive.count(condition, function (err, count) {
    callback(err, count);
  });
};