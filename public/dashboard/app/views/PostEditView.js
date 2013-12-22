define([
  'jquery',
  'underscore',
  'backbone',
  'pagedown',
  'doT',
  'views/ui/AlertView',
  'models/PostModel',
  'text!templates/post_edit.html'
], function ($, _, Backbone, Markdown, doT, AlertView, PostModel, PostEditTemplate) {
  var PostEditView = Backbone.View.extend({

    template: doT.template(PostEditTemplate),

    events: {
      'submit': 'submit'
    },

    initialize: function () {
      _.bindAll(this, 'render');
    },

    render: function () {
      this.setElement(this.template(this.model.toJSON()));
      return this;
    },

    onRendered: function () {
      var converter = Markdown.getSanitizingConverter();
      var editor = new Markdown.Editor(converter);
      editor.run();
    },

    submit: function () {
      this.model.set({
        title: this.$("#post_title").val(),
        slug: this.$("#post_slug").val(),
        created: this.$("#post_created").val(),
        tags: this.$("#post_tags").val().split(','),
        content: this.$(".post_content").val()
      });
      this.model.save(null, {
        success: function () {
          var alertView = new AlertView({type: "success", message: "编辑成功"});
          alertView.$el.prependTo($("#main"));
        }
      });

      return false;
    }
  });

  return PostEditView;

});