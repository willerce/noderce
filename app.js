/**
 * Module dependencies.
 */

var express = require('express');
var morgan = require('morgan');
var fs = require('fs');

// var http = require('http');
var routes = require('./routes');
var config = require('./config.js').config;
var partials = require('express-partials');

var app = express();
var static_dir = __dirname + '/public';
var theme_static_dir = __dirname + '/views/theme/' + config.theme + '/assets';
var admin_static_dir = __dirname + '/views/admin/assets';

// create a write stream (in append mode)
var accessLogStream = fs.createWriteStream(__dirname + '/error.log', {flags: 'a'});
app.use(morgan('short', {
  stream: accessLogStream,
  skip: function(req, res){ // 只记录错误和跳转响应
    return res.statusCode < 300 || res.statusCode == 304;
  }
}));

app.configure(function () {
  app.set('port', config.port);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.compress());
  app.use(partials());
  app.use(express.favicon(__dirname + '/public/favicon.ico'));
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.cookieParser());
  app.use(express.session({ secret: config.session_secret }));
  app.locals.moment= require('moment');
  app.locals.moment.lang('zh-cn');
});

app.configure('development', function () {
  app.use("/admin/assets", express.static(admin_static_dir));
  app.use("/theme/assets", express.static(theme_static_dir));
  app.use(express.static(static_dir));
  app.use(express.errorHandler({
    dumpExceptions: true,
    showStack: true
  }));
});

app.configure('production', function () {
  var one_year = 31557600000;
  app.use("/admin/assets", express.static(admin_static_dir));
  app.use("/theme/assets", express.static(theme_static_dir));
  app.use(express.static(static_dir, {
    maxAge: one_year
  }));
  app.use(express.errorHandler());
  app.set('view cache', true);
});

routes(app);

app.listen(app.get('port'), function () {
  console.log("Express server listening on port " + app.get('port'));
});
