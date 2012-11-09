/**
 * User: willerce
 * Date: 7/30/12
 * Time: 12:23 AM
 */

var blog = require('./routes/blog');
var admin = require('./routes/admin');

module.exports = function (app) {
  app.get('/', blog.index);
  app.get('/post/:slug', blog.post);
  app.get(/^\/p\/(\d+)$/, blog.index);
  app.get('/feed', blog.feed);
  app.get('/archives', blog.archives);
  app.get('/page/:slug', blog.page);
  app.post('/comment', blog.comment);

  /* admin */
  app.get('/admin', admin.auth_user, admin.index);
  app.get('/admin/install', admin.install);
  app.post('/admin/install', admin.install);


  app.get('/admin/login', admin.login);
  app.post('/admin/login', admin.login);
  app.get('/admin/logout', admin.auth_user, admin.logout);

  app.get('/admin/post', admin.auth_user, admin.postIndex);
  app.get('/admin/post/write', admin.auth_user, admin.postWrite);
  app.post('/admin/post/write', admin.auth_user, admin.postWrite);
  app.get('/admin/post/edit/:slug', admin.auth_user, admin.postEdit);
  app.post('/admin/post/edit/:slug', admin.auth_user, admin.postEdit);
  app.post('/admin/post/delete/:slug', admin.auth_user, admin.postDelete);

  app.get('/admin/page', admin.auth_user, admin.pageIndex);
  app.get('/admin/page/write', admin.auth_user, admin.pageWrite);
  app.post('/admin/page/write', admin.auth_user, admin.pageWrite);
  app.get('/admin/page/edit/:slug', admin.auth_user, admin.pageEdit);
  app.post('/admin/page/edit/:slug', admin.auth_user, admin.pageEdit);

  app.get('/admin/comment', admin.auth_user, admin.commentIndex);
  app.get('/admin/comment/delete/:id', admin.auth_user, admin.commentDelete);

  app.get('*', blog.pageNotFound);
};