define([
  'underscore',
  'backbone',
  'models/PostModel'
], function (_, Backbone, Post) {
  'use strict';

  var PostsCollection = Backbone.Collection.extend({
    model: Post,
    url: "/api/post"
  });

  return PostsCollection;
});