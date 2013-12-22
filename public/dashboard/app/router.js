define([
  'jquery',
  'backbone',
  'doT',
  'collections/PostsCollection',
  'models/PostModel',
  'views/ui/LoadingView',
  'views/AppView',
  'views/PostListView',
  'views/PostEditView',
  'views/PostAddView'
], function ($, Backbone, doT, PostsCollection, PostModel, LoadingView, AppView, PostListView, PostEditView, PostAddView) {
    "use strict";

    var Workspace = Backbone.Router.extend({

      routes: {
        "": "home",
        "post": "post",
        "post/add": "postAdd",
        "post/:id": "postEdit",
        "comment": "comment"
      },

      doc: $("#main"),

      initialize: function () {
        this.loadingView = new LoadingView({el: this.doc});
      },

      // #/
      home: function () {
        var view = new AppView()
        this.switchView(view);

        view.render()
        this.renderView(view)
      },

      // #/post
      post: function () {
        console.log('router.js, got router: #/post/');

        var that = this;
        var collection = new PostsCollection();
        var view = new PostListView({ collection: collection });
        this.switchView(view);

        collection.fetch({
          success: function () {
            view.render();
            that.renderView(view);
          },
          error: function () {
            console.log("failed get collection");
          }
        });
      },

      // #/post/add
      postAdd: function () {
        console.log('router.js, got router: #/post/add');

        var model = new PostModel();
        var view = new PostAddView({model: model});
        this.switchView(view);
        view.render();
        this.renderView(view);

      },

      // #/post/512c4527f7d8797818000001
      postEdit: function (id) {
        console.log('router.js, got router: #/post/' + id);

        var that = this;
        var model = new PostModel({_id: id});
        var view = new PostEditView({model: model});
        this.switchView(view);

        model.fetch({
          success: function () {
            view.render();
            that.renderView(view);
          },
          error: function () {
            console.log("failed get post, id is " + this.model.id);
          }
        });
      },

      // #/comment
      comment: function () {
        this.loadingView.render();


      },

      switchView: function (view) {
        this.loadingView.render();
        if (this.currentView) {
          this.currentView.remove();
        }
        this.currentView = view;
      },

      renderView: function (view) {
        this.doc.html(view.$el);
        if (this.currentView.onRendered) {
          this.currentView.onRendered();
        }
      }

    });

    return Workspace;
  }
);