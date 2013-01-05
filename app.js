/**
 * Module dependencies.
 */

var express = require('express');
var http = require('http');
var routes = require('./routes');
var config = require('./config.js').config;
var partials = require('express-partials');

var app = express();
var static_dir = __dirname + '/public';

app.configure(function(){
  app.set('port', config.port);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(partials());
  app.use(express.favicon(__dirname + '/public/favicon.ico'));
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.cookieParser());
  app.use(express.session({ secret : config.session_secret }));
  //app.use(require('./routes/admin.js').auth_user);// custom middleware
});

app.configure('development', function() {
  app.use(express.static(static_dir));
  app.use(express.errorHandler({
    dumpExceptions : true,
    showStack : true
  }));
});

app.configure('production', function() {
  var one_year = 31557600000;
  app.use(express.static(static_dir, {
    maxAge : one_year
  }));
  app.use(express.errorHandler());
  app.set('view cache', true);
});

routes(app);

http.createServer(app).listen(app.get('port'), function(){
    console.log("Express server listening on port " + app.get('port'));
});
