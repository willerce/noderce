/**
 * User: willerce
 * Date: 7/30/12
 * Time: 11:47 PM
 */

var util = require('../lib/util.js');
var config = require('../config.js').config;
var userDao = require('../dao/user.js');
var postDao = require('../dao/post.js');
var pageDao = require('../dao/page.js');
var dateFormat = require('dateformat');

//URL: /admin
exports.index = function(req,res){
    res.render('admin/index');
};

// URL: /admin/post
exports.postIndex = function(req, res){
  postDao.all(function(err, result){
    if(!err)
      res.render('admin/post_index',{post_list: result});
  });
};

// URL : /admin/post/write
exports.postWrite = function(req,res){
  if (req.method == 'GET') {//render post write view
    res.render('admin/post_write');
  }else if (req.method == 'POST') {// POST a post
    var post = {
      title : req.body.title,
      slug: req.body.slug,
      content : req.body.content,
      created : dateFormat(new Date(req.body.created), "yyyy-mm-dd")
    }

    postDao.insert(post,function(result){
      if(result){
        res.redirect('/admin/post/edit/'+ post.slug);
      }else{
        console.log(error);
      }
    });
  }
};

// URL : /admin/post/edit
exports.postEdit = function(req, res){
  if(req.method == "GET") {
    var slug = req.params.slug;
    postDao.get({slug:slug},function(err, post){
      if(post!=null)
        res.render('admin/post_edit', post);
      else
        res.redirect('/admin/post')
    })
  } else if(req.method == "POST") {
    var post = {
      title : req.body.title,
      slug: req.body.slug,
      content : req.body.content,
      created : dateFormat(new Date(req.body.created), "yyyy-mm-dd")
    };
    postDao.update(req.body.old_slug , post, function(err, result){
      if(!err)
        res.redirect('/admin/post/edit/'+ post.slug+"?msg=success");
    });
  }
};

exports.postDelete = function(req, res){
  if(req.method=="GET"){

  }
}

// URL: /admin/page
exports.pageIndex = function(req, res){
  pageDao.all(function(err, result){
    if(!err)
      res.render('admin/page_index',{page_list: result});
  });
};

// URL : /admin/page/write
exports.pageWrite = function(req,res){
  if (req.method == 'GET') {//render post write view
    res.render('admin/page_write');
  }else if (req.method == 'POST') {// POST a post
    var post = {
      title : req.body.title,
      slug: req.body.slug,
      content : req.body.content,
      created : dateFormat(new Date(req.body.created), "yyyy-mm-dd")
    }

    pageDao.insert(post,function(result){
      if(result){
        res.redirect('/admin/page/edit/'+ post.slug);
      }else{
        console.log(error);
      }
    });
  }
};

// URL : /admin/page/edit
exports.pageEdit = function(req, res){
  if(req.method == "GET") {
    var slug = req.params.slug;
    pageDao.get({slug:slug},function(err, page){
      if(page!=null)
        res.render('admin/page_edit', page);
      else
        res.redirect('/admin/page')
    })
  } else if(req.method == "POST") {
    var page = {
      title : req.body.title,
      slug: req.body.slug,
      content : req.body.content,
      created : dateFormat(new Date(req.body.created), "yyyy-mm-dd")
    };
    pageDao.update(req.body.old_slug , page, function(err, result){
      if(!err)
        res.redirect('/admin/page/edit/'+ page.slug+"?msg=success");
    });
  }
};

//URL: /admin/login
exports.login = function(req, res){
  if(req.method == "GET") {
    res.render("admin/login");
  } else if(req.method == "POST") {
    var name = req.body.name.trim();
    var pass = req.body.pass.trim();
    if(name ==''||pass == ''){
      res.render('admin/login', {
        error : '信息不完整。'
      });
      return;
    }

    //判断用户帐号密码
    userDao.get(name, function(err, user){
      pass = util.md5(pass);
      if(user.password != pass){
        res.render('admin/login', {
          error : '密码错误。'
        });
        return;
      }
      gen_session(user, res);// store session cookie
      res.redirect('/admin');
    });
  }
};

//URL: /admin/logout
exports.logout = function(req, res, next) {
  req.session.destroy();
  res.clearCookie(config.auth_cookie_name, {
    path : '/'
  });
  res.redirect('/');
};

// auth_user middleware
exports.auth_user = function(req, res, next) {
  if (req.session.user) {
    return next();
  }
  else {
    var cookie = req.cookies[config.auth_cookie_name];
    if (!cookie)
      return res.redirect('/admin/login');

    var auth_token = util.decrypt(cookie, config.session_secret);
    var auth = auth_token.split('\t');
    var user_name = auth[0];

    userDao.get(user_name, function(err, user){
      if (user) {
        req.session.user = user;
        return next();
      }
      else{
        return res.redirect('/admin/login');
      }
    });
  }
};

/** private function */
function gen_session(user, res) {
  var auth_token = util.encrypt(user.name + '\t' + user.password , config.session_secret);
  res.cookie(config.auth_cookie_name, auth_token, {
    path : '/',
    maxAge : 1000 * 60 * 60 * 24 * 7
  }); // cookie 有效期1周
};