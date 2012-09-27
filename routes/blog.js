/**
 * User: willerce
 * Date: 7/30/12
 * Time: 12:24 AM
 */

var config = require('../config').config;
var data2xml = require('data2xml');
var marked = require('marked');
var dateFormat = require('dateformat');
var postDao = require('../dao/post');
var pageDao = require('../dao/page');
var runtime = require('../config').runtime;

// URL /
exports.index = function (req, res, next) {
  postDao.count(function (err, count) {
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
      runtime.p['p'+req.params[0]] = {title:title, posts:result, crtP:currentPage, maxP:maxPage, nextP:nextPage}
      res.render('index', runtime.p['p'+req.params[0]]);
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
      post.page_title = config.name + " › " + post.title;
      res.render('post', post);
      runtime.post[req.params.slug] = post;
    }
  });
};

// URL: /page/slug
exports.page = function (req, res, next) {
  pageDao.get({'slug':req.params.slug}, function (err, page) {
    if (!err && page != null) {
      page.content = marked(page.content);
      page.page_title = config.name + " › " + page.title;
      return res.render('page', page);
    }
    else{
      next();
    }
  });
};

// URL: /feed
exports.feed = function (req, res) {
  if (!config.rss) {
    res.statusCode = 404;
    return res.send('Please set `rss` in config.js');
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
          name:config.rss.author.name,
          uri:config.rss.author.uri
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
  }
  var archiveList = new Array();
  postDao.all(function (err, archives) {
    for (var i = 0; i < archives.length; i++) {
      var year = new Date(archives[i].created).getFullYear();
      if (archiveList[year] === undefined)
        archiveList[year] = { year:year, archives:[]};
      archiveList[year].archives.push(archives[i]);
    }
    archiveList =  archiveList.sort(sortNumber)
    res.render('archives', {page_title:config.name + " › 文章存档", archives:archiveList});
    runtime.archiveList = archiveList;
  });
};

// URL: /404
exports.pageNotFound = function (req, res) {
  console.log('404 handler..')
  res.render('404', {
    status:404,
    title:'NodeBlog'
  });
};