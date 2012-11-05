/**
 * User: willerce
 * Date: 7/30/12
 * Time: 12:24 AM
 */

var config = require('../config').config;
var data2xml = require('data2xml');
var marked = require('marked');
var dateFormat = require('dateformat');
var gravatar = require('gravatar');

var postDao = require('../dao/post');
var pageDao = require('../dao/page');
var commentDao = require('../dao/comment');


// URL /
exports.index = function (req, res, next) {
  postDao.count(function (err, count) {
    if(count==0) {
      res.redirect("/admin/install");
    };
    var maxPage = parseInt(count / config.postNum) + (count % config.postNum ? 1 : 0);
    var currentPage = isNaN(parseInt(req.params[0])) ? 1 : parseInt(req.params[0]);
    if (currentPage <= 0) currentPage = 1;
    var nextPage = currentPage;
    var title = config.name;
    if (currentPage > 1)
      title += " › 第" + currentPage + "页";

    //skin，即起始位置
    var start = ( currentPage - 1) * config.postNum;

    if (maxPage < currentPage)
      return;
    else if (maxPage > currentPage)
      nextPage = parseInt(currentPage) + 1;

    postDao.findAll(start, parseInt(config.postNum), function (err, result) {
      for (var i = 0; i < result.length; i++) {
        result[i].content = marked(result[i].content);
      }
      var index_obj = {title:title, posts:result, crtP:currentPage, maxP:maxPage, nextP:nextPage}
      res.render(config.theme + '/index', index_obj);
    });
  });
};

// URL: /post/slug
exports.post = function (req, res, next) {
  postDao.get({slug:req.params.slug}, function (err, post) {
    if (err) {
      res.statusCode = 500;
      return res.send('500');
    } else if (post == null) {
      next();
    } else {
      post.content = marked(post.content);
      var page_title = config.name + " › " + post.title;

      commentDao.findByPostid(post._id.toString(), function (err, comments) {

        for(var i = 0;i<comments.length;i++){
          comments[i].avatar = gravatar.url(comments[i].email,{s: '36', r: 'pg', d: 'mm'});
        }
        if (!err) {
          res.render(config.theme + '/post', {page_title:page_title, post:post, comments:comments});
        } else {
          res.statusCode = 500;
          return res.send('500');
        }

      });
    }
  });
};

// URL: /page/slug
exports.page = function (req, res, next) {
  pageDao.get({'slug':req.params.slug}, function (err, page) {
    if (!err && page != null) {
      page.content = marked(page.content);
      page.page_title = config.name + " › " + page.title;
      res.render(config.theme + '/page', page);
    }
    else {
      next();
    }
  });
};

// POST URL: /comment
exports.comment = function (req, res, next) {
  var id = req.body.id;
  var slug = req.body.slug;

  postDao.get({slug:slug}, function (err, post) {
    if (!err && post != null) {
      var comment = {
        post_id:req.body.id,
        post_slug:req.body.slug,
        author:req.body.a_uthor,
        email:req.body.e_mail,
        url:req.body.u_rl,
        content:req.body.c_ontent,
        created:dateFormat(new Date(), "isoDateTime")
      };

      //TODO 用户输入的验证，必填项，邮箱地址是否正确，URL是否正确（无前缀的自动带上http://）
      if (comment.author == "" || comment.email == "") {
        res.redirect("/post/" + post.slug);
      }

      if (!comment.url.indexOf('http://') == 0 && !comment.url.indexOf('https://') == 0 && comment.url!="") {//没有带http://或者https://
        comment.url = "http://" + comment.url;
      }

      commentDao.insert(comment, function (err, comment) {
        if (!err) {
          res.redirect("/post/" + post.slug);
        }
      });

    } else {
      next();
    }
  });
};

// URL: /feed
exports.feed = function (req, res) {
  if (!config.rss) {
    res.statusCode = 404;
    res.send('Please set `rss` in config.js');
  }

  postDao.findAll(0, parseInt(config.rss.max_rss_items), function (err, result) {
    if (err) {
      return next(err);
    }
    var rss_obj = {
      _attr:{ version:'2.0' },
      channel:{
        title:config.rss.title,
        description:config.rss.description,
        link:config.rss.link,
        language:config.rss.language,
        managingEditor:config.rss.language,
        webMaster:config.rss.language,
        generator:config.rss.generator,
        item:[]
      }
    };

    for (var i = 0; i < result.length; i++) {
      var post = result[i];
      post.content = marked(post.content);

      rss_obj.channel.item.push({
        title:post.title,
        author:{
          name:config.rss.author.name
        },
        link:config.rss.link + '/post/' + post.slug,
        guid:config.rss.link + '/post/' + post.slug,
        pubDate:dateFormat(new Date(post.created)),
        lastBuildDate:dateFormat(new Date(post.created)),
        description:marked(post.content)
      });
    }
    var rss_content = data2xml('rss', rss_obj);
    res.contentType('application/xml');
    res.send(rss_content);
  });
};

// URL: /archive
exports.archives = function (req, res) {
  var sortNumber = function (a, b) {
    return a.year < b.year
  };
  var archiveList = new Array();
  postDao.all(function (err, archives) {
    for (var i = 0; i < archives.length; i++) {
      var year = new Date(archives[i].created).getFullYear();
      if (archiveList[year] === undefined)
        archiveList[year] = { year:year, archives:[]};
      archiveList[year].archives.push(archives[i]);
    }
    archiveList = archiveList.sort(sortNumber)
    res.render(config.theme + '/archives', {page_title:config.name + " › 文章存档", archives:archiveList});
  });
};

// URL: /404
exports.pageNotFound = function (req, res) {
  console.log('404 handler, URL'+req.originalUrl);
  res.render(config.theme + '/404', {
    status:404,
    title:'NodeBlog'
  });
};