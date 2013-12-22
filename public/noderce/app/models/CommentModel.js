define([
  'underscore',
  'backbone'
], function (_, Backbone) {
  "use strict";

  var CommentModel = Backbone.Model.extend({

    urlRoot: "/api/comment/",
    idAttribute: "_id",
    defaults: {
      _id: null

    }

  });

  return CommentModel;
});

