/**
 * User: willerce
 * Date: 9/6/12
 * Time: 10:32 PM
 */

var db = require('../config.js').db;

db.user = db.bind('user');

exports.insert = function (user, callback) {
  db.user.insert(user, function (err, result) {
    callback(err, result);
  });
};

exports.findAll = function (query, callback) {
  db.user.find(query).toArray(function (err, result) {
    callback(err, result);
  });
};

exports.get = function (name, callback) {
  db.user.find({name:name}).toArray(function (err, result) {
    callback(err, result[0]);
  });
};