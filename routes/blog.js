var config = require('../config').config;
var data2xml = require('data2xml');
var marked = require('marked');
var dateFormat = require('dateformat');
var gravatar = require('gravatar');
var akismet = require('akismet').client({blog: config.akismet_options.blog, apiKey: config.akismet_options.apikey});

var postDao = require('../dao/post');
var pageDao = require('../dao/page');
var commentDao = require('../dao/comment');


// URL /
exports.index = function (req, res, next) {
  postDao.count(function (err, count) {
    if (count == 0) {
      res.redirect("/admin/install");
    }
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
        if (result[i].content.indexOf('<!--more-->') > 0) {
          result[i].content = result[i].content.substring(0, result[i].content.indexOf('<!--more-->')) + '<div class="ReadMore"><a href="/post/' + result[i].slug + '">[阅读更多]</a></div>';
        }
      }
      var index_obj = {name: config.name, title: config.name, posts: result, crtP: currentPage, maxP: maxPage, nextP: nextPage};
      res.render(config.theme + '/index', index_obj);
    });
  });
};

// URL: /post/slug
exports.post = function (req, res, next) {
  postDao.get({slug: req.params.slug}, function (err, post) {
    if (err) {
      res.statusCode = 500;
      res.send('500');
    } else if (post == null) {
      next();
    } else {
      post.content = marked(post.content);
      //如果不存在 content_html，更新
      if (!post.content_html) {
        post.content_html = marked(post.content);
        postDao.update(post.slug, {content_html: post.content_html}, function () {
        })
      }
      var page_title = config.name + " › " + post.title;

      commentDao.findByPostId(post._id.toString(), function (err, comments) {

        for (var i = 0; i < comments.length; i++) {
          if (!comments[i].avatar) {
            comments[i].avatar = gravatar.url(comments[i].email, {s: '36', r: 'pg', d: 'mm'});
            commentDao.updateAvater(comments[i]._id.toString(), comments[i].avatar, function () {
            })
          }
        }
        if (!err) {
          res.render(config.theme + '/post', {title: page_title, post: post, comments: comments, name: config.name});
        } else {
          res.statusCode = 500;
          res.send('500');
        }
      });
    }
  });
};

// URL: /page/slug
exports.page = function (req, res, next) {
  pageDao.get({'slug': req.params.slug}, function (err, page) {
    if (!err && page != null) {
      page.content = marked(page.content);
      //如果不存在 content_html，更新
      if (!page.content_html) {
        page.content_html = marked(page.content);
        pageDao.update(page.slug, {content_html: page.content_html}, function () {
        })
      }
      page.page_title = config.name + " › " + page.title;
      res.render(config.theme + '/page', {page: page, name: config.name, title: page.page_title});
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

  if (id == "" || slug == "" || !req.headers['referer'] || req.headers['referer'].indexOf(slug) <= 0) {
    return res.redirect("/fuck-spam-comment");
  } else {
    postDao.get({slug: slug}, function (err, post) {
      if (!err && post != null) {
        var comment = {
          post_id: req.body.id,
          post_slug: req.body.slug,
          author: req.body.a_uthor,
          email: req.body.e_mail,
          url: req.body.u_rl,
          content: req.body.c_ontent,
          ip: req.ip,
          created: dateFormat(new Date(), "isoDateTime"),
          status: "1"//状态： 1：正常，0：SPAM
        };

        // 非空检查
        if (comment.author == "" || comment.email == "" || comment.content == "") {
          return res.redirect("/post/" + post.slug);
        }

        // URL 格式检查
        var regexp = /http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w\- ./?%&=]*)?/;
        if (!comment.url.match(regexp)) {
          comment.url = "http://" + comment.url;
          if (!comment.url.match(regexp)) {
            delete comment.url;
          }
        }

        comment.avatar = gravatar.url(comment.email, {s: '36', r: 'pg', d: 'mm'});
        commentDao.insert(comment, function (err, comment) {
          if (!err && comment && comment.length == 1) {
            //配置了 akismet key 而且不为空时，进行 akismet spam检查
            if (config.akismet_options && config.akismet_options.apikey != "") {
              akismet.checkSpam({
                user_ip: comment[0].ip,
                permalink: config.url + "/post/" + comment[0].post_slug,
                comment_author: comment[0].author,
                comment_content: comment[0].content,
                comment_author_email: comment[0].email,
                comment_author_url: comment[0].url,
                comment_type: "comment"
              }, function (err, spam) {
                //发现SPAM
                if (spam) {
                  console.log('Spam caught.');
                  comment[0].status = "0";//状态： 1：正常，0：SPAM
                  commentDao.save(comment[0], function (err, result) {
                    if (!err)
                      console.log("save comment status success");
                    else
                      console.log("save comment status failed");
                  });
                }
              });
            }
            return res.redirect("/post/" + post.slug);
          }
        });
      } else {
        return next();
      }
    });
  }
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
      _attr: { version: '2.0' },
      channel: {
        title: config.rss.title,
        description: config.rss.description,
        link: config.rss.link,
        language: config.rss.language,
        managingEditor: config.rss.language,
        webMaster: config.rss.language,
        generator: config.rss.generator,
        item: []
      }
    };

    for (var i = 0; i < result.length; i++) {
      var post = result[i];
      post.content = marked(post.content);

      rss_obj.channel.item.push({
        title: post.title,
        author: {
          name: config.rss.author.name
        },
        link: config.rss.link + '/post/' + post.slug,
        guid: config.rss.link + '/post/' + post.slug,
        pubDate: dateFormat(new Date(post.created)),
        lastBuildDate: dateFormat(new Date(post.created)),
        description: marked(post.content)
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
  var archiveList = [];
  postDao.all(function (err, archives) {
    for (var i = 0; i < archives.length; i++) {
      var year = new Date(archives[i].created).getFullYear();
      if (archiveList[year] === undefined)
        archiveList[year] = { year: year, archives: []};
      archiveList[year].archives.push(archives[i]);
    }
    archiveList = archiveList.sort(sortNumber);
    res.render(config.theme + '/archives', {title: config.name + " › 文章存档", archives: archiveList, name: config.name});
  });
};

// URL: /404
exports.pageNotFound = function (req, res) {
  console.log('404 handler, URL' + req.originalUrl);
  res.render(config.theme + '/404', {
    layout: false,
    status: 404,
    title: 'NodeBlog'
  });
};