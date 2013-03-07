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
var commentDao = require('../dao/comment.js');
var dateFormat = require('dateformat');
var marked = require('marked');

var akismet = require('akismet').client({blog: config.akismet_options.blog, apiKey: config.akismet_options.apikey, debug: true});

//URL: /admin
exports.index = function (req, res) {
  res.render('admin/index', {layout: false});
};

// URL: /admin/post
exports.postIndex = function (req, res) {
  postDao.all(function (err, result) {
    if (!err)
      res.render('admin/post_index', {layout: false, post_list: result});
  });
};

// URL : /admin/post/write
exports.postWrite = function (req, res) {
  if (req.method == 'GET') {//render post write view
    res.render('admin/post_write', {layout: false});
  } else if (req.method == 'POST') {// POST a post

    var created = dateFormat(new Date(), "yyyy-mm-dd");
    if (req.body.created)
      created = dateFormat(new Date(req.body.created), "yyyy-mm-dd");

    var post = {
      title: req.body.title,
      slug: req.body.slug,
      content: req.body.content,
      content_html: marked(req.body.content),
      created: created,
      tags: req.body.tags.split(',')
    };

    postDao.insert(post, function (err, result) {
      if (!err) {
        res.redirect('/admin/post/edit/' + post.slug);
      } else {
        console.log("error");
      }
    });
  }
};

// URL : /admin/post/edit
exports.postEdit = function (req, res) {
  if (req.method == "GET") {
    var slug = req.params.slug;
    postDao.get({slug: slug}, function (err, post) {
      if (post != null)
        res.render('admin/post_edit', {layout: false, post: post});
      else
        res.redirect('/admin/post')
    })
  } else if (req.method == "POST") {

    var created = dateFormat(new Date(), "yyyy-mm-dd");
    if (req.body.created)
      created = dateFormat(new Date(req.body.created), "yyyy-mm-dd");

    var post = {
      title: req.body.title,
      slug: req.body.slug,
      content: req.body.content,
      content_html: marked(req.body.content),
      created: created,
      tags: req.body.tags.split(',')
    };
    postDao.update(req.body.old_slug, post, function (err) {
      if (!err)
        res.redirect('/admin/post/edit/' + post.slug + "?msg=success");
    });
  }
};

exports.postDelete = function (req, res) {
  if (req.method == "GET") {

  }
};

// URL: /admin/page
exports.pageIndex = function (req, res) {
  pageDao.all(function (err, result) {
    if (!err)
      res.render('admin/page_index', {layout: false, page_list: result});
  });
};

// URL : /admin/page/write
exports.pageWrite = function (req, res) {
  if (req.method == 'GET') {//render post write view
    res.render('admin/page_write', {layout: false});
  } else if (req.method == 'POST') {// POST a post

    var created = dateFormat(new Date(), "yyyy-mm-dd");
    if (req.body.created)
      created = dateFormat(new Date(req.body.created), "yyyy-mm-dd")

    var page = {
      title: req.body.title,
      slug: req.body.slug,
      content: req.body.content,
      content_html: marked(req.body.content),
      created: created
    };

    pageDao.insert(page, function (err, result) {
      if (!err) {
        res.redirect('/admin/page/edit/' + page.slug);
      } else {
        console.log(err);
      }
    });
  }
};

// URL : /admin/page/edit
exports.pageEdit = function (req, res) {
  if (req.method == "GET") {
    var slug = req.params.slug;
    pageDao.get({slug: slug}, function (err, page) {
      if (page != null)
        res.render('admin/page_edit', {layout: false, page: page});
      else
        res.redirect('/admin/page')
    })
  } else if (req.method == "POST") {

    var created = dateFormat(new Date(), "yyyy-mm-dd");
    if (req.body.created)
      created = dateFormat(new Date(req.body.created), "yyyy-mm-dd");

    var page = {
      title: req.body.title,
      slug: req.body.slug,
      content: req.body.content,
      content_html: marked(req.body.content),
      created: created
    };
    pageDao.update(req.body.old_slug, page, function (err, result) {
      if (!err)
        res.redirect('/admin/page/edit/' + page.slug + "?msg=success");
    });
  }
};

exports.commentIndex = function (req, res) {
  var limit = 100;
  var status = req.query['status'];
  if (!status) status = '1';
  commentDao.all({status: status}, limit, function (err, comments) {
    postDao.all(function (err, posts) {
      res.render('admin/comment_index', {layout: false, comment_list: comments, posts: posts, status: status});
    });
  })
};

exports.commentDelete = function (req, res) {
  commentDao.deleteById(req.params.id, function (err, result) {
    res.redirect("/admin/comment");
  })
};


exports.verifyAkismet = function (req, res) {
  akismet.verifyKey(function (err, verified) {
    if (verified)
      res.render('admin/verifyAkismet', {layout: false, status: true});
    else
      res.render('admin/verifyAkismet', {layout: false, status: false});
  });
};

exports.submitSpam = function (req, res) {
  commentDao.findOne(req.params.id, function (err, comment) {
    if (!err) {
      akismet.submitSpam({
        user_ip: comment.ip,
        permalink: config.url + "/post/" + comment.post_slug,
        comment_author: comment.author,
        comment_author_email: comment.email,
        comment_author_url: comment.url,
        comment_type: "comment",
        comment_content: comment.content
      }, function (err) {
        console.log('Spam reported to Akismet.');
        comment.status = "0";//状态： 1：正常，0：SPAM
        commentDao.save(comment, function (err, result) {
          if (!err)
            console.log("save comment status success");
          else
            console.log("save comment status failed");
        });
      });
    }
    res.redirect("/admin/comment");
  });


};


//URL: /admin/login
exports.login = function (req, res) {
  if (req.method == "GET") {
    res.render("admin/login", {layout: false});
  } else if (req.method == "POST") {
    var name = req.body.name.trim();
    var pass = req.body.pass.trim();
    if (name == '' || pass == '') {
      res.render('admin/login', {
        layout: false,
        error: '信息不完整。'
      });
      return;
    }

    //判断用户帐号密码
    userDao.get(name, function (err, user) {
      pass = util.md5(pass);
      if (user.password != pass) {
        res.render('admin/login', {
          layout: false,
          error: '密码错误。'
        });
        return;
      }
      gen_session(user, res);// store session cookie
      res.redirect('/admin');
    });
  }
};

//URL: /admin/logout
exports.logout = function (req, res, next) {
  req.session.destroy();
  res.clearCookie(config.auth_cookie_name, {
    path: '/'
  });
  res.redirect('/');
};

// auth_user middleware
exports.auth_user = function (req, res, next) {
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

    userDao.get(user_name, function (err, user) {
      if (user) {
        req.session.user = user;
        return next();
      }
      else {
        return res.redirect('/admin/login');
      }
    });
  }
};

// URL:  /install
exports.install = function (req, res, next) {

  userDao.findAll({}, function (err, result) {
    if (!err) {
      if (result.length > 0) {
        /** 已经初始化过了 ***/
        if (req.query['msg'] == "success")
          res.render('admin/install', {layout: false, msg: "success"})
        else
          res.render('admin/install', {layout: false, installed: true})
      } else {
        /***未初始化过***/
        if (req.method == "GET") {
          res.render('admin/install', {layout: false});
        } else if (req.method == "POST") {

          //将用户输入的帐密插入到 user 表中
          var user = {
            name: req.body.name,
            password: util.md5(req.body.password)
          };

          //插入一个用户
          userDao.insert(user, function (err, result) {
            if (!err) {

              //发布一个 Hello World! 的文章
              var post = {
                title: "Hello world!",
                slug: "hello-world",
                content: "欢迎使用 noderce. 这是程序自动发布的一篇文章。欢迎 fork noderce : https://github.com/willerce/noderce",
                created: dateFormat(new Date(), "yyyy-mm-dd")
              };

              postDao.insert(post, function (err, result) {
                if (!err) {
                  //在 Hello world! 下发表一篇评论
                  var comment = {
                    post_id: post._id.toString(),
                    post_slug: post.slug,
                    author: "willerce",
                    email: "willerce@gmail.com",
                    url: "http://willerce.com",
                    content: "欢迎使用Noderce，欢迎与我交流Nodejs相关技术、",
                    created: dateFormat(new Date(), "isoDateTime")
                  };


                  commentDao.insert(comment, function (err, result) {
                    if (!err) res.redirect('/admin/install?msg=success');
                  });
                }

              });
            }
          });
        }
      }
    } else {
      next();
    }
  });
};

/** private function */
function gen_session(user, res) {
  var auth_token = util.encrypt(user.name + '\t' + user.password, config.session_secret);
  res.cookie(config.auth_cookie_name, auth_token, {
    path: '/',
    maxAge: 1000 * 60 * 60 * 24 * 7
  }); // cookie 有效期1周
}