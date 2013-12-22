define([
  'jquery',
  'underscore',
  'backbone',
  'doT',
  'collections/PostsCollection',
  'text!templates/post_list.html'
], function ($, _, Backbone, doT, PostsCollection, PostListTemplate) {
  "use strict";

  var PostListView = Backbone.View.extend({

    template: doT.template(PostListTemplate),

    initialize: function () {
      _.bindAll(this, 'render');
    },

    render: function () {
      this.setElement(this.template(this.collection.toJSON()));
      return this;
    }
  });

  return PostListView;

});
