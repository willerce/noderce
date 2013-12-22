define([
  'doT',
  'text!templates/ui/loading.html'
], function (doT, loadingTemplate) {
  "use strict";

  var LoadingView = Backbone.View.extend({
    template: doT.template(loadingTemplate),
    render: function () {
      this.$el.html(this.template);
    }
  });

  return LoadingView;
});