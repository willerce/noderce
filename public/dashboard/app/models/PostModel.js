define([
  'underscore',
  'backbone'
], function (_, Backbone) {
  "use strict";

  var PostModel = Backbone.Model.extend({

    urlRoot: "/api/post/",
    idAttribute: "_id",
    defaults: {
      _id: null,
      title: '',
      slug: '',
      created: '',
      tags: [],
      content: '',
      content_html: ''
    }

  });

  return PostModel;
});
