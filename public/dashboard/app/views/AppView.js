define([
  'jquery',
  'underscore',
  'backbone',
  'doT',
  'collections/PostsCollection',
  'text!templates/app.html'
], function ($, _, Backbone, doT, Posts, AppTemplate) {
  "use strict";

  var AppView = Backbone.View.extend({

    template: doT.template(AppTemplate),

    initialize: function () {
      this.render();
    },

    render: function () {
      this.setElement(this.template());
      return this;
    },

    close: function(){
      this.unbind();
      this.remove();
    }

  });

  return AppView;

});
